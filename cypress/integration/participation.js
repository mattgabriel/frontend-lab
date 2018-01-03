import wallet from "../fixtures/walletReadyToTrade.json";

it("Invest after first investment during setup", () => {
  cy.visit("http://localhost:3000/");
  window.localStorage.setItem("wallet:melon.fund", JSON.stringify(wallet));
  cy.get("form[name='participation']").should("be.visible");
  cy.get("form[name='participation']").submit();
  cy.get("[name='password']").type("password");
  cy.get("form[data-hook=modal]").submit();
  cy
    .contains("Waiting time required", { timeout: 60 * 1000 })
    .should("be.visible");
  cy.contains("Execute my request!", { timeout: 5 * 60 * 1000 }).click();
  cy.get("[name='password']").type("password");
  cy.get("form[data-hook=modal]").submit();
  cy
    .get("form[name='participation']", { timeout: 60 * 1000 })
    .should("be.visible");
});

it("Redeem after first investment during setup", () => {
  cy.visit("http://localhost:3000/");
  window.localStorage.setItem("wallet:melon.fund", JSON.stringify(wallet));
  cy.get("form[name='participation']").should("be.visible");
  cy
    .get("form[name='participation']")
    .contains("Redeem")
    .click();
  cy.get("form[name='participation']").submit();
  cy.get("[name='password']").type("password");
  cy.get("form[data-hook=modal]").submit();
  cy
    .contains("Waiting time required", { timeout: 60 * 1000 })
    .should("be.visible");
  cy.contains("Execute my request!", { timeout: 5 * 60 * 1000 }).click();
  cy.get("[name='password']").type("password");
  cy.get("form[data-hook=modal]").submit();
  cy
    .get("form[name='participation']", { timeout: 60 * 1000 })
    .should("be.visible");
});
