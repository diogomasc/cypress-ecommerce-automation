describe("Gestão do Carrinho de Compras", () => {
  beforeEach(() => {
    // Ignora erros de requisições externas que podem ocorrer durante os testes
    cy.ignoreCollectError();
    // Limpa o carrinho de compras antes de cada teste para garantir que os testes sejam independentes e não afetados por estados anteriores
    cy.cleanCart();
    cy.visit("/", { failOnStatusCode: false });
  });

  afterEach(() => {
    cy.wait(1500);
  });

  it("Adicionar um produto ao carrinho com sucesso validando incremento no carrinho", () => {
    // 1. Acessar a página inicial do site
    cy.visit("/");

    // 2. Clicar no produto "Grey jacket" para acessar a página de detalhes do produto
    cy.get("#product-1").click();

    // 3. Na página de detalhes do produto, clicar no botão "Add to cart" para adicionar o produto ao carrinho
    cy.get("#add").should("be.visible").click();

    // 4. Validar que o carrinho de compras foi atualizado com o produto adicionado, verificando o número de itens no ícone do carrinho
    cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");

    // 5. Acessar a página do carrinho de compras para validar os detalhes do produto adicionado
    cy.visit("/cart");

    // Valida os detalhes do produto adicionado
    // Título
    cy.get(".info h3").should("contain", "Grey jacket");
    // Preço unitário
    cy.get(".two.columns.price.desktop").should("contain", "£55.00");
    // Quantidade
    cy.get(".quantity.tr input").should("have.value", "1");
    // Total do item (preço unitário x quantidade)
    cy.get(".two.columns.total.desktop").should("contain", "£55.00");
    // Total do carrinho (soma de todos os itens)
    cy.get(".six.columns.omega.cart.total h2").should(
      "contain",
      "Total £55.00",
    );
  });

  it("Alterar a quantidade de um item no carrinho", () => {
    // 1. Acessar a página inicial do site
    cy.visit("/");

    // 2. Clicar no produto "Grey jacket" para acessar a página de detalhes do produto
    cy.get("#product-1").click();

    // 3. Na página de detalhes do produto, clicar no botão "Add to cart" para adicionar o produto ao carrinho
    cy.get("#add").should("be.visible").click();

    // 4. Validar que o carrinho de compras foi atualizado com o produto adicionado, verificando o número de itens no ícone do carrinho
    cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");

    // 5. Acessar a página do carrinho de compras para validar os detalhes do produto adicionado
    cy.visit("/cart");

    // 6. Alterar a quantidade do item "Grey jacket" para 2 unidades
    cy.get(".quantity.tr input").clear().type("2");

    // 7. Clicar no botão "Update" para atualizar a quantidade do item no carrinho
    cy.get("#update").should("be.visible").click();

    // 7. Validar que o total do item foi atualizado corretamente para refletir a nova quantidade (preço unitário x nova quantidade)
    cy.get(".two.columns.total.desktop").should("contain", "£110.00");

    // 8. Validar que o total do carrinho também foi atualizado para refletir a nova quantidade
    cy.get(".six.columns.omega.cart.total h2").should(
      "contain",
      "Total £110.00",
    );
  });

  it("Erro ao inserir quantidade excessiva (Bug Detectado)", () => {
    // 1. Acessar a página inicial do site
    cy.visit("/");

    // 2. Clicar no produto "Grey jacket" para acessar a página de detalhes do produto
    cy.get("#product-1").click();

    // 3. Na página de detalhes do produto, clicar no botão "Add to cart" para adicionar o produto ao carrinho
    cy.get("#add").should("be.visible").click();

    // 4. Validar que o carrinho de compras foi atualizado com o produto adicionado, verificando o número de itens no ícone do carrinho
    cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");

    // 5. Acessar a página do carrinho de compras para validar os detalhes do produto adicionado
    cy.visit("/cart");

    // 6. Alterar a quantidade do item "Grey jacket" para 1000000 unidades (limite máximo permitido)
    cy.get(".quantity.tr input").clear().type("1000000");

    // 7. Clicar no botão "Update" para atualizar a quantidade do item no carrinho
    cy.get("#update").should("be.visible").click();

    // 8. Validar que o sistema aceita a quantidade máxima permitida e atualiza o total do item e do carrinho corretamente
    cy.get(".two.columns.total.desktop").should("contain", "£55,000,000.00");
    cy.get(".six.columns.omega.cart.total h2").should(
      "contain",
      "Total £55,000,000.00",
    );

    // 9. Alterar a quantidade do item "Grey jacket" para 1000001 unidades (acima do limite permitido)
    cy.get(".quantity.tr input").clear().type("1000001");

    // 10. Clicar no botão "Update" para tentar atualizar a quantidade do item no carrinho
    cy.get("#update").should("be.visible").click();

    // 11. Validar que o sistema exibe a mensagem de erro "Something went wrong"
    cy.get(".content--desc-large").should("contain", "Something went wrong.");
    cy.get(".content--desc").should("contain", "Cart Error: Cart Error");
    cy.get(".content--desc ul li a").should(
      "contain",
      "Return to the previous page.",
    );
  });

  it("Remover um item do carrinho", () => {
    // 1. Acessar a página inicial do site
    cy.visit("/");
    // 2. Clicar no produto "Grey jacket" para acessar a página de detalhes do produto
    cy.get("#product-1").click();
    // 3. Na página de detalhes do produto, clicar no botão "Add to cart" para adicionar o produto ao carrinho
    cy.get("#add").should("be.visible").click();
    // 4. Validar que o carrinho de compras foi atualizado com o produto adicionado, verificando o número de itens no ícone do carrinho
    cy.get(".cart-target", { timeout: 3000 }).should("contain", "(1)");
    // 5. Acessar a página do carrinho de compras para validar os detalhes do produto adicionado
    cy.visit("/cart");
    // 6. Localiza a 'Grey jacket' e clica no botão 'Remove' específico dela
    cy.contains(".info h3", "Grey jacket") // Acha o título do produto
      .closest(".row") // Sobe até o container da linha inteira
      .find(".remove.desktop a") // Desce apenas dentro desta linha para achar o botão
      .click();

    // 7. Validar que o item foi removido do carrinho, verificando que o título do produto não está mais presente na página do carrinho
    cy.contains(".info h3", "Grey jacket").should("not.exist");

    // 8. Validar que o carrinho exibe a mensagem indicando que está vazio
    cy.get(".h1").should("contain", "My Cart");
    cy.get("#page-content").should(
      "contain",
      "It appears that your cart is currently empty!",
    );
  });
});
