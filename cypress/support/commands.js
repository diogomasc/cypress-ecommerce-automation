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
