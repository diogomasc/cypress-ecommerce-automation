// Comando para realizar uma busca de produto
Cypress.Commands.add('searchProduct', (term) => {
  cy.get("#product-search input.search")
    .should("be.visible")
    .type(`${term}{enter}`);
});

// Comando para validar se todos os itens da grade contêm um termo no título
Cypress.Commands.add('validateProductsInGrid', (term) => {
  const normalizedTerm = term.toLowerCase();

  cy.get(".product-grid .four.columns")
    .should("have.length.at.least", 1)
    .each(($el) => {
      cy.wrap($el)
        .find("h3")
        .invoke("text")
        .then((text) => {
          expect(text.toLowerCase()).to.contain(normalizedTerm);
        });
    });
});
