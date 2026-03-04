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

// Comando customizado para criar uma conta de usuário
Cypress.Commands.add("createAccount", () => {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };

  // 1. Navegação e preenchimento
  cy.visit("/account/register", { failOnStatusCode: false });

  cy.get("#first_name").should("be.visible").type(user.firstName);
  cy.get("#last_name").type(user.lastName);
  cy.get("#email").type(user.email);
  cy.get("#password").type(user.password);

  // 2. Submissão
  cy.get(".action_bottom").contains("Create").click();

  // 3. Validação de Fluxo
  cy.url().should("include", "/");

  // 4. Validação de Persistência na conta
  cy.visit("/account");
  cy.get(".sidebar .customer-name", { timeout: 10000 })
    .should("be.visible")
    .and("contain", `${user.firstName} ${user.lastName}`);

  // 5. Faz logout para garantir que o estado da conta não interfira em outros testes
  cy.contains("a", "Log Out").click();

  // 6. Retorna o objeto para uso nos testes
  return cy.wrap(user);
});
