import { faker } from "@faker-js/faker";

Cypress.Commands.add('createAccount', () => {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 6 }),
  };

  // 1. Navegação e preenchimento
  cy.visit("/");
  cy.navigateToRegisterPage();
  cy.fillRegistrationForm(user);

  // 2. Submissão
  cy.submitRegistration();

  // 3. Validação de Persistência   
  cy.navigateToAccountPage();
  cy.validateSidebarName(`${user.firstName} ${user.lastName}`);

  // 4. Logout e validação final
  cy.navigateToLogoutPage();
  cy.get("#customer_login_link")
    .should("be.visible")
    .and("contain", "Log In");

  // 5. Retorna o objeto para uso nos testes
  return cy.wrap(user);
});