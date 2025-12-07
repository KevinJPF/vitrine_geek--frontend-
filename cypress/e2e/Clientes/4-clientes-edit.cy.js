describe("Edição de Cliente com Endereço e Cartão", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/admin/clientes");
  });

  it("Deve editar dados do cliente, endereço e cartão", () => {
    // Abre cliente já existente (ex: Tony Stark)
    cy.contains("Tony Stark")
      .parents('[data-cy="card-cliente"]')
      .find('[data-cy="btn-editar-cliente"]')
      .click();

    // Verifica se entrou na tela de edição
    cy.url().should("include", "admin/editar-cliente");

    // === Edita dados pessoais ===
    cy.get('[data-cy="input-nome-cliente"]')
      .clear()
      .type("Anthony Edward Stark");
    cy.get('[data-cy="input-email-cliente"]')
      .clear()
      .type("stark@avengers.com");
    cy.get('[data-cy="input-cpf-cliente"]').clear().type("98765432100");
    cy.get('[data-cy="input-telefone"]').clear().type("988888888");
    cy.get('[data-cy="dropdown-genero"]').click();
    cy.get('[data-cy="dropdown-genero-masculino"]').click();

    // === Edita endereço existente ===
    cy.get('[data-cy="card-endereco"]').first().click(); // abre popup de edição
    cy.get('[data-cy="input-cidade"]').clear().type("Nova York");
    cy.get('[data-cy="input-logradouro"]').clear().type("Stark Tower");
    cy.get('[data-cy="switch-endereco-favorito"]').check({ force: true });
    cy.get('[data-cy="btn-salvar-endereco"]').click();

    // === Edita cartão existente ===
    cy.get('[data-cy="card-cartao"]').first().click(); // abre popup de edição
    cy.get('[data-cy="input-nome-cartao"]').clear().type("Cartão Avengers");
    cy.get('[data-cy="input-numero-cartao"]').clear().type("5555444433331111");
    cy.get('[data-cy="dropdown-id-bandeira"]').click();
    cy.get('[data-cy="dropdown-id-bandeira-mastercard"]').click();
    cy.get('[data-cy="btn-salvar-cartao"]').click();

    // === Salva alterações ===
    cy.get('[data-cy="btn-confirmar-cliente"]').click();

    // === Verificações ===
    cy.url().should("include", "/clientes");

    // Nome atualizado
    cy.contains("Anthony Edward Stark").should("exist");

    // Email atualizado
    cy.contains("stark@avengers.com").should("exist");
  });
});
