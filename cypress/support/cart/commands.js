// Comando para adicionar o produto atual ao carrinho
Cypress.Commands.add('addToCart', () => {
  cy.get("#add").should("be.visible").click();
});

// Comando para validar a quantidade no ícone do carrinho (header)
Cypress.Commands.add('validateCartCount', (count) => {
  cy.get(".cart-target", { timeout: 3000 }).should("contain", `(${count})`);
});

// Comando para atualizar a quantidade de um item dentro da página /cart
Cypress.Commands.add('updateCartQuantity', (quantity) => {
  cy.get(".quantity.tr input").should("be.visible").clear().type(quantity);
  cy.get("#update").click();
});


// Comando para validar os totais exibidos na página do carrinho
Cypress.Commands.add('validateCartTotal', (value) => {
  cy.get(".two.columns.total.desktop").should("contain", value);
  cy.get(".six.columns.omega.cart.total h2").should("contain", `Total ${value}`);
});
