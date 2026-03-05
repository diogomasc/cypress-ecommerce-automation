import { faker } from "@faker-js/faker";

// Custom command para ignorar erros de requisições externas (como /api/collect) que são monitorados pelo Cypress e podem causar falhas nos testes
Cypress.Commands.add("ignoreCollectError", () => {
  cy.on("uncaught:exception", (err) => {
    if (
      err.message.includes("Unexpected token") ||
      err.message.includes("reading 'description'") ||
      err.message.includes("null")
    ) {
      return false;
    }
  });
});

// Custom command para limpar o carrinho de compras usando a API do Shopify, garantindo que o estado do carrinho seja limpo antes de cada teste
Cypress.Commands.add("cleanCart", () => {
  return cy.request({
    method: "POST",
    url: "/cart/clear.js",
    failOnStatusCode: false,
  });
});

// Comando para navegar até a página de login
Cypress.Commands.add('navigateToLoginPage', () => {
  cy.get("#customer_login_link")
    .should("be.visible")
    .and("contain", "Log In")
    .click();
});

// Comando para navegar até a página de registro de novo usuário
Cypress.Commands.add('navigateToRegisterPage', () => {
  cy.get("#customer_register_link")
    .should("be.visible")
    .and("contain", "Sign up")
    .click();
});

// Comando para navegar até a página de conta
Cypress.Commands.add('navigateToAccountPage', () => {
  cy.contains("a", "My Account")
    .should("be.visible")
    .click();
});

// Comando para navegar até a página de logout
Cypress.Commands.add('navigateToLogoutPage', () => {
  cy.get("#customer_logout_link")
    .should("be.visible")
    .and("contain", "Log Out")
    .click();
});

// Comando para navegar até o carrinho
Cypress.Commands.add('navigateToCartPage', () => {
  cy.get("#minicart")
    .find("a.checkout")
    .should("be.visible")
    .click();
});

// Comando para navegar até o catálogo via menu principal
Cypress.Commands.add('navigateToCatalogPage', () => {
  cy.get("#main-menu a[href='/collections/all']")
    .should("be.visible")
    .click();
});
