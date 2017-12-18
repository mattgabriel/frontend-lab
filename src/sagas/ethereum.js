import { take, put, takeLatest, select, apply, call } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  setup,
  onBlock,
  getParityProvider,
  importWalletFromMnemonic,
  // encryptWallet,
  createWallet,
  decryptWallet,
} from "@melonproject/melon.js";

import { types as browserTypes } from "../actions/browser";
import { actions as ethereumActions } from "../actions/ethereum";
import { actions as fundActions } from "../actions/fund";

// import Wallet from "ethers-wallet";
import loadedWallet from "../_key/wallet.json";

const MAX_BLOCK_TIME = 20 * 1000;

function* init() {
  const { provider, providerType, api } = getParityProvider();

  setup.init({
    provider,
    daemonAddress: "0x00360d2b7D240Ec0643B6D819ba81A09e40E5bCd",
  });

  yield put(ethereumActions.setProvider(providerType));

  // Reading the fund address from the URL
  const fund = yield select(state => state.fund);
  const networkId = yield apply(api, api.net.version);

  yield put(ethereumActions.hasConnected(networkId));

  // TODO: Real functionality which can create a new wallet if needed
  setup.wallet = yield call(
    importWalletFromMnemonic,
    "galaxy arrange tower sentence gift hub pony butter inner critic vessel echo",
  );
  setup.defaultAccount = setup.wallet.address;
  // setup.wallet = yield call(
  //   decryptWallet,
  //   JSON.stringify(loadedWallet),
  //   "9tjSQGCx5z9TZHtDMLClRdzcmBhj8z4fN8u9dWhOI2vpumDGAksBGlESJ2",
  // );

  // const wallet = localStorage.getItem("wallet:melon.fund");
  // setup.wallet = JSON.parse(wallet);
  // setup.defaultAccount = setup.wallet.address;

  if (fund.address !== "" && fund.name === "-") {
    yield put(fundActions.infoRequested(fund.address));
  }

  const blockChannel = eventChannel(emitter => {
    let blockTimeout;

    const setBlockOverdue = () => {
      emitter({ blockOverdue: true });
    };

    // Immediately get infos from the latest block before watching new blocks
    onBlock().then(data => emitter({ onBlock: data })); // ;

    blockTimeout = window.setTimeout(setBlockOverdue, MAX_BLOCK_TIME);

    const sub = api.subscribe("eth_blockNumber", () => {
      onBlock().then(data => emitter({ onBlock: data }));
      window.clearTimeout(blockTimeout);
      blockTimeout = window.setTimeout(setBlockOverdue, MAX_BLOCK_TIME);
    });

    return () => {
      console.error("Cannot stop this atm", sub);
      // filter.stopWatching();
    };
  });

  while (true) {
    const data = yield take(blockChannel);

    if (data.onBlock) {
      const currentAccount = yield select(state => state.ethereum.account);

      yield put(ethereumActions.newBlock(data.onBlock));

      if (currentAccount !== data.onBlock.account) {
        const account = data.onBlock.account.startsWith("0x")
          ? data.onBlock.account
          : `0x${data.onBlock.account}`;
        console.log("******* ", account);
        yield put(ethereumActions.accountChanged(account));
      }
    } else {
      yield put(ethereumActions.blockOverdue());
    }
  }
}

function* ethereum() {
  yield takeLatest(browserTypes.LOADED, init);
}

export default ethereum;
