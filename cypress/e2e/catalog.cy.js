describe("Feature: Catálogo de Produtos", () => {
  beforeEach(() => {
    cy.ignoreCollectError();
    // 1. Acessar a página inicial do sistema
    cy.visit("/");
  });

  afterEach(() => {
    // Intervalo técnico para evitar bloqueios de rede (Rate Limit)
    cy.wait(3000);
  });

  it("Passo a passo: Verificação do título da página via navegação no menu", () => {
    // 1. Localizar e clicar no link de Catálogo no menu principal
    cy.navigateToCatalogPage();

    // 2. Verificar se o breadcrumb de navegação exibe o texto "Products"
    cy.get("#breadcrumb")
      .should("be.visible")
      .and("contain", "Products");
  });

  it("Passo a passo: Validar filtro de busca por termo textual", () => {
    const termoBuscado = "Black";

    // 1. Digitar o termo de busca no campo de pesquisa e pressionar Enter
    cy.searchProduct(termoBuscado);

    // 2. Percorrer a grade de resultados e validar se cada título de produto contém o termo
    cy.validateProductsInGrid(termoBuscado);
  });

  it("Passo a passo (BUG): Validar busca por caractere único", () => {
    const termoBuscado = "D";

    // 1. Realizar busca pelo caractere "D"
    cy.searchProduct(termoBuscado);

    // 2. Validar se o sistema filtra corretamente apenas produtos que possuam a letra "D" no nome
    // Nota: Este teste falha se o site retornar produtos que não respeitem o filtro
    cy.validateProductsInGrid(termoBuscado);
  });
});