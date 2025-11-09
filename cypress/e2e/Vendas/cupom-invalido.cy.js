describe("Fluxo de Venda Completo", () => {
  beforeEach(() => {
    // Configurar interceptadores para as chamadas de API
    cy.intercept("GET", "**/produtos").as("getProdutos");
    cy.intercept("GET", "**/carrinhos/1").as("getCarrinho");
    cy.intercept("POST", "**/carrinhos").as("addCarrinho");
  });

  // Teste adicional para validação de cupom inválido
  it("Deve tratar cupom inválido adequadamente", () => {
    // Adicionar produto ao carrinho primeiro
    cy.visit("http://localhost:5173/produtos");
    cy.wait("@getProdutos");
    cy.get('[data-cy="card-produto-0"]').first().click();
    cy.get('[data-cy="btn-adicionar-ao-carrinho"]').click();
    cy.wait("@addCarrinho");

    // Verificar se foi redirecionado para o carrinho
    cy.url().should("include", "/carrinho");
    cy.wait("@getCarrinho");

    // 5. Continuar para o checkout
    cy.get('[data-cy="btn-continuar-pagamento"]')
      .should("be.visible")
      .should("not.have.class", "btn-disabled")
      .click();

    // Tentar aplicar cupom inválido
    cy.get('[data-cy="input-cupom"]').type("CUPOMINVALIDO");
    cy.get('[data-cy="btn-aplicar-cupom"]').click();
  });
});
