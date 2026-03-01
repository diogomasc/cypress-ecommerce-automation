describe("Gestão do Carrinho de Compras", () => {
  beforeEach(() => {
    // Ignora erros de requisições externas que podem ocorrer durante os testes
    cy.ignoreCollectError();
    // Limpa o carrinho de compras antes de cada teste para garantir que os testes sejam independentes e não afetados por estados anteriores
    cy.cleanCart();
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
});
