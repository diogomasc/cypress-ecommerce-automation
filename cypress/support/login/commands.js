// Comando para realizar login no sistema
Cypress.Commands.add('login', (email, password) => {
  cy.get("#customer_email").should("be.visible").type(email);
  cy.get("#customer_password").type(password);
  cy.get('.action_bottom input[type="submit"]')
    .should('have.value', 'Sign In')
    .click();
});

// Comando para preencher o formulário de registro (sem submeter)
Cypress.Commands.add('fillRegistrationForm', (user) => {
  if (user.firstName) cy.get("#first_name").type(user.firstName);
  if (user.lastName) cy.get("#last_name").type(user.lastName);
  if (user.email) cy.get("#email").type(user.email);
  if (user.password) cy.get("#password").type(user.password);
});

// Comando para submeter o formulário de criação de conta
Cypress.Commands.add('submitRegistration', () => {
  cy.get('.action_bottom input[type="submit"]')
    .should('have.value', 'Create')
    .click();
});

// Comando para validar o nome do usuário na sidebar da conta
Cypress.Commands.add('validateSidebarName', (fullName) => {
  cy.get("section.sidebar")
    .should("be.visible")
    .find(".customer-name")
    .should("contain", fullName);
});
