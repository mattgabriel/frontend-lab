<img src = "https://github.com/melonproject/branding/blob/master/melon/Social%20Media%20Profile%20Picture%202-01.jpg" width = "30%">

# ipfs-frontend

IPFS Front-end application of the Melon portal. 


## Installation

1. Clone this repository
    ```
    git clone git@github.com:melonproject/ipfs-frontend.git
    cd ipfs-frontend

    ```

2. Install dependencies:
    ```
    npm install
    ```
**Right now, the Melon.js library is injected with a local link, not through npm (see instructions in Melon.js repo, under Link Dev Build section: https://github.com/melonproject/melon.js)**.

## Getting started

After installation is complete

Go to the above `ipfs-frontend` directory, open a terminal and launch the react application:

```
npm start
```

## Build

```
npm run-script build
```

## Deploy

You need to have IPFS installed accessible from the path folder and run the IPFS daemon:

```
ipfs daemon
```

```
npm run-script deploy
```
