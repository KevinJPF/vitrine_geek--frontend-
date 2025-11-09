describe("Fluxo de Venda Completo", () => {
  beforeEach(() => {
    // Configurar interceptadores para as chamadas de API
    cy.intercept("GET", "**/produtos").as("getProdutos");
    cy.intercept("POST", "**/carrinhos").as("addCarrinho");
    cy.intercept("GET", "**/carrinhos/1").as("getCarrinho");
    cy.intercept("PUT", "**/carrinhos/*").as("updateCarrinho");
    cy.intercept("GET", "**/meus-pedidos").as("getPedidos");
  });

  it("Deve completar o fluxo de venda do início ao fim", () => {
    // 1. Acessar a página de listagem de produtos
    cy.visit("http://localhost:5173/produtos");
    cy.wait("@getProdutos");

    // Verificar se a página de produtos carregou
    cy.contains("Produtos").should("be.visible");

    // 2. Selecionar o primeiro produto
    cy.get('[data-cy="card-produto-0"]').should("be.visible").click();

    // Verificar se chegou na página de detalhes
    cy.url().should("include", "/detalhes-produto/0");

    // 3. Adicionar produto ao carrinho
    cy.get('[data-cy="btn-adicionar-ao-carrinho"]')
      .should("be.visible")
      .click();

    cy.wait("@addCarrinho");

    // Verificar se foi redirecionado para o carrinho
    cy.url().should("include", "/carrinho");
    cy.wait("@getCarrinho");

    // 4. Aumentar a quantidade do produto no carrinho
    // Encontrar o botão de aumentar quantidade e clicar duas vezes
    cy.get('[data-cy="btn-increase-quantity"]')
      .first()
      .click()
      .wait("@updateCarrinho");

    cy.get('[data-cy="btn-increase-quantity"]')
      .first()
      .click()
      .wait("@updateCarrinho");

    // Verificar se a quantidade foi atualizada (deve estar em 3)
    cy.get('[data-cy="product-quantity"]').first().should("contain", "3");

    // 5. Continuar para o checkout
    cy.get('[data-cy="btn-continuar-pagamento"]')
      .should("be.visible")
      .should("not.have.class", "btn-disabled")
      .click();

    // Verificar se chegou na página de checkout
    cy.url().should("include", "/checkout");

    // 6. Aplicar cupom de desconto
    cy.get('[data-cy="input-cupom"]').should("be.visible").type("DESCONTA10");

    cy.get('[data-cy="btn-aplicar-cupom"]').should("be.visible").click();

    // Verificar se o cupom foi aplicado (deve aparecer na seção de desconto)
    cy.contains("Desconto").should("be.visible");
    cy.contains("DESCONTA10").should("be.visible");

    // 7. Alterar endereço de entrega
    cy.get('[data-cy="btn-mudar-endereco"]').should("be.visible").click();

    // Verificar se o modal de endereços abriu
    cy.get('[data-cy="modal-endereco"]').should("be.visible");

    // Selecionar um endereço (assumindo que existe pelo menos um)
    cy.get('[data-cy="select-endereco-1"]').first().click();

    // Verificar se o modal fechou
    cy.get('[data-cy="modal-endereco"]').should("not.exist");

    // 8. Verificar método de pagamento (opcional - alterar se necessário)
    cy.get('[data-cy="btn-mudar-pagamento"]').should("be.visible");

    // 9. Finalizar a compra
    cy.get('[data-cy="btn-finalizar-compra"]').should("be.visible").click();

    // Verificar se foi para a página de confirmação
    cy.url().should("include", "/pedido-confirmado");
    cy.contains("Pedido Confirmado").should("be.visible");

    // 10. Ir para a listagem de pedidos
    cy.get('[data-cy="btn-meus-pedidos"]').should("be.visible").click();

    // Verificar se chegou na página de pedidos
    cy.url().should("include", "/meus-pedidos");
    // cy.wait("@getPedidos");

    // Verificar se a listagem de pedidos está visível
    cy.contains("Meus Pedidos").should("be.visible");

    // Verificar se o pedido recém-criado aparece na lista
    cy.contains("Pedido #").should("be.visible");
  });
});
