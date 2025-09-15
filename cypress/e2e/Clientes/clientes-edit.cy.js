describe("Edição de Cliente", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/clientes"); // rota da listagem
  });

  it("Deve editar um cliente existente", () => {
    // Encontra o cliente pelo nome e clica em editar
    cy.contains("Tony Stark")
      .parents('[data-cy="card-cliente"]') // div que representa o cliente
      .find('[data-cy="btn-editar-cliente"]')
      .click();

    // Verifica se carregou a tela de edição
    cy.url().should("include", "/editar-cliente");

    // Altera o email
    cy.get('[data-cy="input-email-cliente"]').clear().type("tony@avengers.com");

    // Confirma edição
    cy.get('[data-cy="btn-confirmar-cliente"]').click();

    // Verifica se o email foi atualizado
    cy.contains("tony@avengers.com").should("exist");
  });
});
