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

// Custom command para limpar o carrinho de compras
Cypress.Commands.add("cleanCart", () => {
  cy.visit("/cart");
  cy.get("body").then(($body) => {
    const btnRemove = $body.find(".remove.desktop a:visible");
    if (btnRemove.length > 0) {
      cy.wrap(btnRemove).first().click();
      cy.wait(1000);
      cy.cleanCart();
    } else {
      cy.log("O carrinho já está vazio!");
    }
  });
});
