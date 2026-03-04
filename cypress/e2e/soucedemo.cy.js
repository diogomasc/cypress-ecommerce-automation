import { faker } from "@faker-js/faker";

describe("Source Demo", () => {
  beforeEach(() => {
    cy.ignoreCollectError();
  });

  afterEach(() => {
    cy.wait(3000); // Respiro para evitar Rate Limit (429)
  });

  describe("Feature: Carrinho de Compras", () => {
    beforeEach(() => {
      cy.cleanCart();
    });

    it.skip("Scenario: Deve adicionar um produto e validar o incremento no contador", () => {
      // ==== Ponto inicial: Acessar a homepage e clicar no produto 'Grey jacket' ====

      // Given: que estou na homepage e clico no produto 'Grey jacket'
      cy.visit("/");
      cy.get("#product-1").click();

      // ==== Ponto inial alternativo para acessar a página do produto diretamente (sem clicar na homepage) ====
      // cy.visit("/collections/frontpage/products/grey-jacket");

      // When: eu adiciono o item ao carrinho
      cy.get("#add").should("be.visible").click();

      // Then: o contador do cabeçalho deve ser (1)
      cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");

      // And: os detalhes no resumo do carrinho devem estar corretos
      cy.visit("/cart");
      cy.get(".info h3").should("contain", "Grey jacket");
      cy.get(".quantity.tr input").should("have.value", "1");
      cy.get(".two.columns.total.desktop").should("contain", "£55.00");
      cy.get(".six.columns.omega.cart.total h2").should(
        "contain",
        "Total £55.00",
      );
    });

    it.skip("Scenario: Deve atualizar os valores ao alterar a quantidade de um item", () => {
      // Given: que já tenho um item no carrinho
      cy.visit("/collections/frontpage/products/grey-jacket");
      cy.get("#add").should("be.visible").click();
      cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");
      cy.visit("/cart");

      // When: eu altero a quantidade para 2 e atualizo
      cy.get(".quantity.tr input").clear().type("2");
      cy.get("#update").should("be.visible").click();

      // Then: o valor total deve ser recalculado (55 * 2)
      cy.get(".two.columns.total.desktop").should("contain", "£110.00");
      cy.get(".six.columns.omega.cart.total h2").should(
        "contain",
        "Total £110.00",
      );
    });

    it.skip("Scenario: Deve validar o comportamento do sistema ao inserir quantidades excessivas (Limite/Bug)", () => {
      // Given: que adicionei um produto e estou no carrinho
      cy.visit("/collections/frontpage/products/grey-jacket");
      cy.get("#add").click();
      cy.get("#add").should("be.visible").click();
      cy.visit("/cart");

      // When: eu tento atualizar para a quantidade máxima aceita (1 milhão)
      cy.get(".quantity.tr input").clear().type("1000000");
      cy.get("#update").click();

      // Then: o sistema deve aceitar e recalcular o total corretamente (£55M)
      cy.get(".total.desktop").should("contain", "£55,000,000.00");
      cy.get(".cart.total h2").should("contain", "Total £55,000,000.00");

      // When: eu tento extrapolar o limite (1 milhão + 1)
      cy.get(".quantity.tr input").clear().type("1000001");
      cy.get("#update").click();

      // Then: o sistema deve exibir a página de erro (Comportamento de Bug Detectado)
      cy.get(".content--desc-large").should("contain", "Something went wrong.");
      cy.get(".content--desc").should("contain", "Cart Error: Cart Error");
      cy.get(".content--desc ul li a").should(
        "contain",
        "Return to the previous page.",
      );
    });

    it.skip("Scenario: Deve remover um item específico da listagem", () => {
      // Given: que estou no carrinho com a 'Grey jacket' adicionada
      cy.visit("/collections/frontpage/products/grey-jacket");
      cy.get("#add").click();
      cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");
      cy.visit("/cart");

      // When: eu clico em remover na linha do produto correspondente
      cy.get("section#cart")
        .contains(".info h3", "Grey jacket")
        .closest(".row")
        .find(".remove a")
        .click();

      // Then: o produto não deve mais existir no DOM
      cy.get("section#cart")
        .contains(".info h3", "Grey jacket")
        .should("not.exist");
      cy.get("p").should(
        "contain",
        "It appears that your cart is currently empty!",
      );
    });

    it.skip("Scenario: Deve permitir retornar à vitrine pelo link 'Continue Shopping'", () => {
      // Given: que o carrinho está vazio
      cy.visit("/cart");

      // When: eu clico no link de continuar comprando
      cy.get("section#cart").find("a[href='/collections/all']").click();

      // Then: a URL deve ser a da coleção completa
      cy.url().should("include", "/collections/all");
    });
  });

  describe("Feature: Registro de Novo Usuário", () => {
    // Geramos um usuário novo para cada execução do describe
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    beforeEach(() => {
      cy.clearCookies();
    });

    // TODO
    it.skip("Scenario: Validar criação de conta com sucesso", () => {
      // Given: que estou na página de registro
      cy.visit("/account/register");

      // When: eu preencho todos os campos obrigatórios e clico em Create
      cy.get("input#first_name").type(user.firstName);
      cy.get("input#last_name").type(user.lastName);
      cy.get("input#email").type(user.email);
      cy.get("input#password").type(user.password);
      cy.get('input[value="Create"]').click();

      console.log("=========== Usuário gerado para teste:", user);

      // Then: devo ser redirecionado para a home
      cy.url().should("include", "/");

      // And: ao acessar minha conta, os dados devem estar corretos
      cy.contains("a", "My Account").click();

      cy.get("section.sidebar")
        .should("be.visible")
        .find(".customer-name")
        .and("contain", `${user.firstName} ${user.lastName}`);
    });

    // TODO
    it.skip("Scenario: Validar cadastro sem digitar o 'First name'", () => {
      // Given: que estou na página de registro
      cy.visit("/account/register");

      // When: eu preencho os campos exceto o nome
      cy.get("input#last_name").type(user.lastName);
      cy.get("input#email").type(user.email);
      cy.get("input#password").type(user.password);
      cy.get('input[value="Create"]').click();

      console.log("=========== Usuário gerado para teste:", user);

      // Then: o sistema deve exibir um erro de campo obrigatório
      cy.get(".errors li")
        .should("be.visible")
        .and("contain.text", "First name can't be blank.");
    });

    // TODO
    it.skip("Scenario: Cadastro de usuário com e-mail já cadastrado", () => {
      // Given: que já existe uma conta com um determinado e-mail
      cy.createAccount().then(({ email }) => {
        // When: eu tento registrar um novo usuário com o mesmo e-mail
        cy.visit("/account/register");
        cy.get("input#first_name").type(user.firstName);
        cy.get("input#last_name").type(user.lastName);
        cy.get("input#email").type(email);
        cy.get("input#password").type(user.password);
        cy.get('input[value="Create"]').click();

        console.log("=========== Usuário gerado para teste:", user);

        // Then: deve exibir erro de duplicidade com link para reset de senha
        cy.get(".errors li")
          .should("be.visible")
          .and(
            "contain.text",
            "This email address is already associated with an account",
          )
          .and("contain.text", "reset your password");
      });
    });
  });

  describe("Feature: Login", () => {
    beforeEach(() => {
      cy.clearCookies();
    });

    // TODO
    it.skip("Scenario: Validar login com dados válidos", () => {
      cy.createAccount().then(({ firstName, lastName, email, password }) => {
        // Given: que estou na página de login
        cy.visit("/account/login");

        // When: eu preencho as credenciais válidas e clico em Sign In
        cy.get("#customer_email").type(email);
        cy.get("#customer_password").type(password);
        cy.get(".action_bottom").contains("Sign In").click();

        // Then: devo ser redirecionado para a página da minha conta
        cy.url().should("include", "/account");

        // And: o meu nome completo deve estar visível na sidebar
        cy.get(".sidebar .customer-name")
          .should("be.visible")
          .and("contain", `${firstName} ${lastName}`);
      });
    });

    // TODO
    it.skip("Scenario: Validar login com dados inválidos", () => {
      // Given: que estou na página de login
      cy.visit("/account/login");

      // When: eu tento logar com dados inexistentes
      cy.get("#customer_email").type("invalid@example.com");
      cy.get("#customer_password").type("invalidpassword");
      cy.get(".action_bottom").contains("Sign In").click();

      // Then: uma mensagem de erro deve ser exibida
      cy.get(".errors li")
        .should("be.visible")
        .and("contain.text", "Incorrect email or password.");
    });

    // TODO
    it.skip("Scenario: Validar logout", () => {
      cy.createAccount().then(({ firstName, lastName, email, password }) => {
        // 1. Setup: Logar no sistema
        cy.visit("/account/login");
        cy.get("#customer_email").type(email);
        cy.get("#customer_password").type(password);
        cy.get(".action_bottom").contains("Sign In").click();

        // 2. Ação de Logout
        // Corrigido o seletor: use find() para navegar dentro do container desktop
        cy.get(".desktop")
          .find("#customer_logout_link")
          .should("be.visible")
          .click();

        // 3. Validação de Saída
        // Then: devo retornar para a home e não ver mais links de conta
        cy.url().should("include", "/");

        cy.get(".desktop").within(() => {
          cy.contains("Log Out").should("not.exist");
          cy.contains("My Account").should("not.exist");

          // And: os links de Log In e Sign Up devem voltar a aparecer
          // Corrigida a sintaxe .should("be.visible")
          cy.get("#customer_login_link")
            .should("be.visible")
            .and("contain", "Log In");
          cy.get("#customer_register_link")
            .should("be.visible")
            .and("contain", "Sign up");
        });
      });
    });
  });

  describe("Feature: Produtos", () => {
    // Passou
    it.skip("Scenario: Verificação do título da página (Navegação via Catálogo)", () => {
      // Given: que estou na home
      cy.visit("/");

      // When: eu busco o link de Catálogo no menu principal e clico
      cy.get("#main-menu li")
        .find("a[href='/collections/all']")
        .should("be.visible")
        .and("contain", "Catalog")
        .click();

      // Then: o breadcrumb deve indicar que estou na página de "Products"
      cy.get("#breadcrumb").should("be.visible").and("contain", "Products");
    });

    // Passou
    it.skip("Scenario: Deve validar que todos os produtos retornados contêm o termo buscado", () => {
      const termoBuscado = "Black";

      cy.visit("/");

      // Given: que estou na home e faço uma busca por um termo específico
      cy.get("#product-search input.search")
        .should("be.visible")
        .type(`${termoBuscado}{enter}`);

      // Then: todos os produtos listados devem conter o termo buscado no título

      // 1. Localiza todos os containers de produtos visíveis
      cy.get(".product-grid .four.columns")
        .should("have.length.at.least", 1) // Garante que veio ao menos um item
        .each(($el) => {
          // 2. Para cada item ($el), busca o título (h3)
          // Usamos cy.wrap($el) para poder usar comandos do Cypress novamente
          cy.wrap($el)
            .find("h3")
            .invoke("text")
            .then((texto) => {
              // 3. Valida se o texto contém o termo (ignora maiúsculas/minúsculas se desejar)
              expect(texto.toLowerCase()).to.contain(
                termoBuscado.toLowerCase(),
              );
            });
        });
    });
  });

  describe("Feature: Check-Out", () => {
    it.skip("Scenario: Checkout com dados válidos como convidado (sem login)", () => {});

    it.skip("Scenario: Validar impedimento de checkout com campo obrigatório vazio.", () => {});
  });
});
