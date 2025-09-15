describe("Desativação de Cliente", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/clientes");
  });

  it("Deve desativar um cliente existente", () => {
    // Encontra o cliente pelo nome e clica em desativar
    cy.contains("Tony Stark")
      .parents('[data-cy="card-cliente"]')
      .find('[data-cy="btn-desativar-cliente"]')
      .click();

    // Confirma (caso tenha modal de confirmação)
    // cy.get('[data-cy="btn-confirmar-desativacao"]').click();

    // Verifica se o cliente aparece como inativo na listagem
    cy.contains("Tony Stark")
      .parents('[data-cy="card-cliente"]')
      .find('[data-cy="status-cliente"]')
      .should("contain.text", "x"); // ou verificar algum ícone/status
  });
});
