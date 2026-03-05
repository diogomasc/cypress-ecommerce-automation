import { faker } from "@faker-js/faker";

describe("Feature: Registro de Novo Usuário", () => {
  let user;

  beforeEach(() => {
    cy.clearCookies();
    cy.ignoreCollectError();

    // Gerar nova massa de dados antes de cada cenário
    user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    };
  });

  afterEach(() => {
    // Intervalo técnico para evitar bloqueios de rede (Rate Limit)
    cy.wait(3000);
  });

  it("Passo a passo: Criação de conta com preenchimento integral dos campos", () => {
    // 1. Navegar até o formulário de registro
    cy.visit("/");
    cy.navigateToRegisterPage();

    // 2. Preencher nome, sobrenome, e-mail e senha
    cy.fillRegistrationForm(user);

    // 3. Submeter o formulário de criação
    cy.submitRegistration();

    // 4. Validar o redirecionamento automático para a home após sucesso
    cy.url().should("include", "/");

    // 5. Acessar o link 'My Account' e validar a persistência dos dados cadastrados
    cy.navigateToAccountPage();
    cy.validateSidebarName(`${user.firstName} ${user.lastName}`);
  });

  it("Passo a passo: Validar obrigatoriedade do campo 'First Name'", () => {
    // 1. Acessar a página de registro
    cy.visit("/");
    cy.navigateToRegisterPage();

    // 2. Preencher os campos obrigatórios, deixando o 'First Name' propositalmente vazio
    const incompleteUser = { ...user, firstName: null };
    cy.fillRegistrationForm(incompleteUser);
    cy.submitRegistration();

    // 3. Validar se o sistema interrompe o cadastro e exibe alerta de campo em branco
    cy.get(".errors li")
      .should("be.visible")
      .and("contain.text", "First name can't be blank.");
  });

  it("Passo a passo: Validar impedimento de cadastro com e-mail duplicado", () => {
    // 1. Criar uma conta prévia para gerar conflito de e-mail
    cy.createAccount().then((existingUser) => {
      // 2. Tentar registrar um novo usuário utilizando o e-mail da conta criada anteriormente
      cy.navigateToRegisterPage();
      cy.fillRegistrationForm({ ...user, email: existingUser.email });
      cy.submitRegistration();

      // 3. Confirmar se o sistema identifica a duplicidade e sugere o reset de senha
      cy.get(".errors li")
        .should("be.visible")
        .and("contain.text", "already associated with an account")
        .and("contain.text", "reset your password");
    });
  });
});
