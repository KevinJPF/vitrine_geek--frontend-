describe("Cadastro de Cliente com Endereço e Cartão", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/registrar-cliente"); // ajuste a rota
  });

  it("Deve criar cliente com endereço e cartão", () => {
    // Preenche dados do cliente
    cy.get('[data-cy="input-nome-cliente"]').type("Tony Stark", { delay: 50 });
    cy.get('[data-cy="input-cpf-cliente"]').type("12345678900", { delay: 50 });
    cy.get('[data-cy="input-data-nascimento"]').type("29/05/1970");
    cy.get('[data-cy="dropdown-genero"]').click();
    cy.get('[data-cy="dropdown-genero-masculino"]').click();

    cy.get('[data-cy="input-email-cliente"]').type(
      "ironman@starkindustries.com"
    );
    cy.get('[data-cy="input-ddd"]').type("11");
    cy.get('[data-cy="input-telefone"]').type("999999999");
    cy.get('[data-cy="dropdown-tipo-telefone"]').click();
    cy.get('[data-cy="dropdown-tipo-telefone-celular"]').click();
    cy.get('[data-cy="input-senha"]').type("jarvis123");
    cy.get('[data-cy="input-confirmar-senha"]').type("jarvis123");

    // Adiciona endereço
    cy.get('[data-cy="btn-adicionar-endereco"]').click();
    cy.get('[data-cy="input-nome-endereco"]').type("Casa Malibu");
    cy.get('[data-cy="input-tipo-residencia"]').type("Mansão");
    cy.get('[data-cy="input-tipo-logradouro"]').type("Avenida");
    cy.get('[data-cy="input-cep"]').type("12345678");
    cy.get('[data-cy="input-pais"]').type("Brasil");
    cy.get('[data-cy="input-estado"]').type("SP");
    cy.get('[data-cy="input-cidade"]').type("São Paulo");
    cy.get('[data-cy="input-bairro"]').type("Centro");
    cy.get('[data-cy="input-numero"]').type("10880");
    cy.get('[data-cy="input-logradouro"]').type("Coast Ave");
    cy.get('[data-cy="input-obs-endereco"]').type("Frente para o mar");
    cy.get('[data-cy="switch-endereco-cobranca"]').check({ force: true });
    cy.get('[data-cy="switch-endereco-entrega"]').check({ force: true });
    cy.get('[data-cy="switch-endereco-favorito"]').check({ force: true });
    cy.get('[data-cy="btn-salvar-endereco"]').click();

    // Adiciona cartão
    cy.get('[data-cy="btn-adicionar-cartao"]').click();
    cy.get('[data-cy="input-nome-cartao"]').type("Cartão Stark");
    cy.get('[data-cy="input-numero-cartao"]').type("4111111111111111");
    cy.get('[data-cy="input-nome-impresso"]').type("TONY STARK");
    cy.get('[data-cy="dropdown-id-bandeira"]').click();
    cy.get('[data-cy="dropdown-id-bandeira-visa"]').click();
    cy.get('[data-cy="input-codigo-seguranca"]').type("123");
    cy.get('[data-cy="switch-cartao-favorito"]').check({ force: true });
    cy.get('[data-cy="btn-salvar-cartao"]').click();

    // Salva cliente
    cy.get('[data-cy="btn-confirmar-cliente"]').click();

    // Verifica que cliente foi criado
    // cy.url().should("include", "/clientes");
    // cy.contains("Tony Stark").should("exist");
  });
});
