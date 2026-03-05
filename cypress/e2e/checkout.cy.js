describe("Feature: Check-Out", () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.ignoreCollectError();
  });

  afterEach(() => {
    // Intervalo técnico para evitar bloqueios de rede (Rate Limit)
    cy.wait(3000);
  });

  it("Scenario: Checkout com dados válidos como convidado (sem login)", () => { });

  it("Scenario: Validar impedimento de checkout com campo obrigatório vazio.", () => { });
});