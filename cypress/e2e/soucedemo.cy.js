describe("Gestão do Carrinho de Compras", () => {
  beforeEach(() => {
    cy.ignoreCollectError();
    cy.cleanCart();
  });

  afterEach(() => {
    cy.wait(3000); // Respiro para evitar Rate Limit (429)
  });

  it("Deve adicionar um produto e validar o incremento no contador", () => {
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

  it.skip("Deve atualizar os valores ao alterar a quantidade de um item", () => {
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

  it.skip("Deve validar o comportamento do sistema ao inserir quantidades excessivas (Limite/Bug)", () => {
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

  it.skip("Deve remover um item específico da listagem", () => {
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
    cy.get("p").should("contain", "It appears that your cart is currently empty!");
  });

  it.skip("Deve permitir retornar à vitrine pelo link 'Continue Shopping'", () => {
    // Given: que o carrinho está vazio
    cy.visit("/cart");

    // When: eu clico no link de continuar comprando
    cy.get("section#cart").find("a[href='/collections/all']").click();

    // Then: a URL deve ser a da coleção completa
    cy.url().should("include", "/collections/all");
  });
});
