describe("Fluxo de Venda Completo", () => {
  beforeEach(() => {
    // Configurar interceptadores para as chamadas de API
    cy.intercept("GET", "**/carrinhos/1").as("getCarrinho");
  });

  // Teste adicional para verificar o fluxo com carrinho vazio
  it("Deve impedir checkout com carrinho vazio", () => {
    cy.visit("http://localhost:5173/carrinho");
    cy.wait("@getCarrinho");

    // Verificar se o botão está desabilitado quando não há produtos
    cy.get('[data-cy="btn-continuar-pagamento"]').should(
      "have.class",
      "btn-disabled"
    );
  });
});
