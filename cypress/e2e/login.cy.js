describe("Feature: Autenticação de Usuário", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.ignoreCollectError();
  });

  afterEach(() => {
    // Intervalo técnico para evitar bloqueios de rede (Rate Limit)
    cy.wait(3000);
  });

  // TODO: Erro de CAPTCHA
  it("Passo a passo: Validar login com credenciais válidas", () => {
    // 1. Criar uma conta dinamicamente para garantir massa de dados ativa
    cy.createAccount().then((user) => {
      // 2. Acessar a página de login e inserir e-mail e senha criados
      cy.navigateToLoginPage();
      cy.login(user.email, user.password);

      // 3. Confirmar se a URL foi redirecionada para a área logada (/account)
      cy.url().should("include", "/account");

      // 4. Validar se o nome completo do usuário é exibido corretamente no menu lateral
      cy.validateSidebarName(`${user.firstName} ${user.lastName}`);
    });
  });

  // TODO: Erro de CAPTCHA
  it("Passo a passo: Validar falha de login com dados incorretos", () => {
    // 1. Acessar a página de login e inserir dados inexistentes no banco
    cy.visit("/");
    cy.navigateToLoginPage();
    cy.login("invalido@teste.com", "senha123");

    // 2. Verificar se a mensagem de erro padrão do sistema é exibida
    cy.get(".errors li")
      .should("be.visible")
      .and("contain.text", "Incorrect email or password.");
  });

  // TODO: Erro de CAPTCHA
  it("Passo a passo: Validar encerramento de sessão (Logout)", () => {
    // 1. Realizar o setup criando uma conta e logando no sistema
    cy.createAccount().then((user) => {
      cy.navigateToLoginPage();
      cy.login(user.email, user.password);

      // 2. Localizar o link de logout no container desktop e acionar o clique
      cy.navigateToLogoutPage();

      // 3. Confirmar o retorno imediato à página inicial (Home)
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);

      // 4. Validar dentro do cabeçalho que os links de conta não estão mais presentes
      cy.get(".desktop").within(() => {
        cy.get("#customer_logout_link").should("not.exist");
        cy.get("#customer_login_link").should("be.visible").and("contain", "Log In");
      });
    });
  });
});
