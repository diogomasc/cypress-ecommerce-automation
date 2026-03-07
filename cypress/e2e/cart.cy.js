describe("Feature: Carrinho de Compras", () => {
  beforeEach(() => {
    cy.ignoreCollectError();
    // 1. Garantir que o carrinho esteja vazio antes de cada teste
    cy.cleanCart();
  });

  afterEach(() => {
    // Intervalo técnico para evitar bloqueios de rede (Rate Limit)
    cy.wait(3000);
  });

  it("Passo a passo: Adição de produto e validação de resumo no cart", () => {
    // 1. Acessar a página específica do produto 'Grey jacket'
    cy.visit("/collections/frontpage/products/grey-jacket");

    // 2. Acionar o botão de adição ao carrinho
    cy.addToCart();

    // 3. Confirmar se o contador global no cabeçalho foi atualizado para (1)
    cy.validateCartCount(1);

    // 4. Navegar para a página de resumo do carrinho
    cy.navigateToCartPage();

    // 5. Validar se o nome, quantidade e preço unitário estão corretos no grid
    cy.get(".info h3").should("contain", "Grey jacket");
    cy.get(".quantity.tr input").should("have.value", "1");
    cy.validateCartTotal("£55.00");
  });

  it("Passo a passo: Recálculo de valores ao alterar quantidade manualmente", () => {
    // 1. Acessar a página específica do produto 'Grey jacket'
    cy.visit("/collections/frontpage/products/grey-jacket");

    // 2. Acionar o botão de adição ao carrinho
    cy.addToCart();

    // 3. Confirmar se o contador global no cabeçalho foi atualizado para (1)
    cy.validateCartCount(1);

    // 4. Navegar para a página de resumo do carrinho
    cy.navigateToCartPage();

    // 5. Modificar a quantidade para '2' e confirmar a atualização
    cy.updateCartQuantity(2);

    // 6. Validar se o sistema aplicou o cálculo matemático correto (55 * 2 = 110)
    cy.validateCartTotal("£110.00");
  });

  it("Passo a passo (BUG): Teste de valor limite de itens", () => {
    // 1. Acessar a página específica do produto 'Grey jacket'
    cy.visit("/collections/frontpage/products/grey-jacket");

    // 2. Acionar o botão de adição ao carrinho
    cy.addToCart();

    // 3. Confirmar se o contador global no cabeçalho foi atualizado para (1)
    cy.validateCartCount(1);

    // 4. Navegar para a página de resumo do carrinho
    cy.navigateToCartPage();

    // 5. Inserir o limite teórico de 1 milhão de unidades e validar recálculo
    cy.updateCartQuantity(1000000);
    cy.validateCartTotal("£55,000,000.00");

    // 6. Tentar extrapolar o limite para verificar o tratamento de erro do sistema
    cy.updateCartQuantity(1000001);
    cy.validateCartTotal("£55,000,055.00");
  });

  it("Passo a passo: Remoção individual de itens da listagem", () => {
    // 1. Acessar a página específica do produto 'Grey jacket'
    cy.visit("/collections/frontpage/products/grey-jacket");

    // 2. Acionar o botão de adição ao carrinho
    cy.addToCart();

    // 3. Confirmar se o contador global no cabeçalho foi atualizado para (1)
    cy.validateCartCount(1);

    // 4. Navegar para a página de resumo do carrinho
    cy.navigateToCartPage();

    // 5. Identificar a linha do produto 'Grey jacket' e acionar o comando 'Remove'
    cy.get("section#cart")
      .contains(".info h3", "Grey jacket")
      .closest(".row")
      .find(".remove a")
      .click();

    // 6. Validar se o elemento foi removido do DOM e se a mensagem de carrinho vazio é exibida
    cy.get(".info h3").should("not.exist");
    cy.get("p").should("contain", "It appears that your cart is currently empty!");
  });

  it("Passo a passo: Navegação de retorno à vitrine (Continue Shopping)", () => {
    // 1. Acessar a página do carrinho vazio
    cy.navigateToCartPage();

    // 2. Clicar no link de redirecionamento para coleções
    cy.get("section#cart").find("a[href='/collections/all']").click();

    // 3. Validar se o navegador foi direcionado para a URL correta do catálogo
    cy.url().should("include", "/collections/all");
  });
});
