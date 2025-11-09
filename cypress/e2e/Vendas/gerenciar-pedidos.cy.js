describe("Gerenciamento de Pedidos - Administrador", () => {
  beforeEach(() => {
    // Configurar interceptadores para as chamadas de API
    cy.intercept("GET", "**/pedidos").as("getPedidos");
    cy.intercept("PATCH", "**/pedidos/*").as("patchPedido");
  });

  it("Deve carregar a lista de pedidos corretamente", () => {
    // Visitar a página de administração de pedidos
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Verificar se a tabela está visível
    cy.get('[data-cy="tabela-pedidos"]').should("be.visible");

    // Verificar se há pelo menos um pedido na lista
    cy.get('[data-cy^="pedido-row-"]').should("have.length.at.least", 1);
  });

  it("Deve exibir todas as informações do pedido na tabela", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Verificar se o primeiro pedido tem todos os campos
    cy.get('[data-cy="pedido-codigo-0"]').should("be.visible");
    cy.get('[data-cy="pedido-comprador-0"]').should("be.visible");
    cy.get('[data-cy="pedido-data-criacao-0"]').should("be.visible");
    cy.get('[data-cy="pedido-data-atualizacao-0"]').should("be.visible");
    cy.get('[data-cy="pedido-valor-0"]').should("be.visible");
    cy.get('[data-cy="pedido-status-0"]').should("be.visible");
    cy.get('[data-cy="btn-gerenciar-pedido-0"]').should("be.visible");
  });

  it("Deve completar o fluxo completo: EM_PROCESSAMENTO -> APROVADA -> EM_TRANSPORTE -> ENTREGUE", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Passo 1: EM_PROCESSAMENTO -> APROVADA
    cy.get('[data-cy="btn-gerenciar-pedido-1"]').click({ delay: 1000 });
    cy.get('[data-cy="dropdown-novo-status-pedido"]').click({ delay: 500 });
    cy.get('[data-cy="dropdown-status-aprovada"]').click({ delay: 500 });
    cy.get('[data-cy="btn-salvar-status-pedido"]').click({ delay: 500 });
    cy.wait("@patchPedido");
    cy.wait("@getPedidos");

    // Verificar se o status mudou para Aprovada
    cy.get('[data-cy="pedido-status-1"]').should("contain", "Aprovada");

    // Passo 2: APROVADA -> EM_TRANSPORTE
    cy.get('[data-cy="btn-gerenciar-pedido-1"]').click({ delay: 1000 });
    cy.get('[data-cy="dropdown-novo-status-pedido"]').click({ delay: 500 });
    cy.get('[data-cy="dropdown-status-em_transporte"]').click({ delay: 500 });
    cy.get('[data-cy="btn-salvar-status-pedido"]').click({ delay: 500 });
    cy.wait("@patchPedido");
    cy.wait("@getPedidos");

    // Verificar se o status mudou para Em Transporte
    cy.get('[data-cy="pedido-status-1"]').should("contain", "Em Transporte");

    // Passo 3: EM_TRANSPORTE -> ENTREGUE
    cy.get('[data-cy="btn-gerenciar-pedido-1"]').click({ delay: 1000 });
    cy.get('[data-cy="dropdown-novo-status-pedido"]').click({ delay: 500 });
    cy.get('[data-cy="dropdown-status-entregue"]').click({ delay: 500 });
    cy.get('[data-cy="btn-salvar-status-pedido"]').click({ delay: 500 });
    cy.wait("@patchPedido");
    cy.wait("@getPedidos");

    // Verificar se o status mudou para Entregue
    cy.get('[data-cy="pedido-status-1"]').should("contain", "Entregue");

    // Verificar se o botão Gerenciar está desabilitado
    cy.get('[data-cy="btn-gerenciar-pedido-1"]').should(
      "have.class",
      "btn-disabled"
    );
  });

  it("Deve reprovar um pedido em processamento", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Clicar em gerenciar no primeiro pedido
    cy.get('[data-cy="btn-gerenciar-pedido-2"]').click();

    // Abrir dropdown e selecionar REPROVADA
    cy.get('[data-cy="dropdown-novo-status-pedido"]').click();
    cy.get('[data-cy="dropdown-status-reprovada"]').click();

    // Confirmar
    cy.get('[data-cy="btn-salvar-status-pedido"]').click();
    cy.wait("@patchPedido");
    cy.wait("@getPedidos");

    // Verificar se o status mudou
    cy.get('[data-cy="pedido-status-2"]').should("contain", "Reprovada");

    // Verificar se o botão está desabilitado
    cy.get('[data-cy="btn-gerenciar-pedido-2"]').should(
      "have.class",
      "btn-disabled"
    );
  });

  it("Deve gerenciar solicitação de troca (EM_TROCA -> TROCA_AUTORIZADA -> TROCADO)", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Encontrar um pedido com status EM_TROCA
    cy.get('[data-cy^="pedido-status-"]').each(($el, index) => {
      if ($el.text().includes("Troca Solicitada")) {
        // Clicar em gerenciar
        cy.get(`[data-cy="btn-gerenciar-pedido-${index}"]`).click();

        // Autorizar a troca
        cy.get('[data-cy="dropdown-novo-status-pedido"]').click();
        cy.get('[data-cy="dropdown-status-troca_autorizada"]').click();
        cy.get('[data-cy="btn-salvar-status-pedido"]').click();
        cy.wait("@patchPedido");
        cy.wait("@getPedidos");

        // Verificar se mudou para Troca Autorizada
        cy.get(`[data-cy="pedido-status-${index}"]`).should(
          "contain",
          "Troca Autorizada"
        );

        // Marcar como trocado
        cy.get(`[data-cy="btn-gerenciar-pedido-${index}"]`).click();
        cy.get('[data-cy="dropdown-novo-status-pedido"]').click();
        cy.get('[data-cy="dropdown-status-trocado"]').click();
        cy.get('[data-cy="btn-salvar-status-pedido"]').click();
        cy.wait("@patchPedido");
        cy.wait("@getPedidos");

        // Verificar se mudou para Trocado
        cy.get(`[data-cy="pedido-status-${index}"]`).should(
          "contain",
          "Trocado"
        );

        return false; // break
      }
    });
  });

  it("Deve recusar uma solicitação de troca", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Encontrar um pedido com status EM_TROCA
    cy.get('[data-cy^="pedido-status-"]').each(($el, index) => {
      if ($el.text().includes("Troca Solicitada")) {
        // Clicar em gerenciar
        cy.get(`[data-cy="btn-gerenciar-pedido-${index}"]`).click();

        // Recusar a troca
        cy.get('[data-cy="dropdown-novo-status-pedido"]').click();
        cy.get('[data-cy="dropdown-status-troca_recusada"]').click();
        cy.get('[data-cy="btn-salvar-status-pedido"]').click();
        cy.wait("@patchPedido");
        cy.wait("@getPedidos");

        // Verificar se mudou para Troca Recusada
        cy.get(`[data-cy="pedido-status-${index}"]`).should(
          "contain",
          "Troca Recusada"
        );

        // Verificar se o botão está desabilitado
        cy.get(`[data-cy="btn-gerenciar-pedido-${index}"]`).should(
          "have.class",
          "btn-disabled"
        );

        return false; // break
      }
    });
  });

  it("Deve cancelar a alteração de status sem salvar", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    // Pegar o status inicial
    cy.get('[data-cy="pedido-status-0"]')
      .invoke("text")
      .then((statusInicial) => {
        // Abrir modal
        cy.get('[data-cy="btn-gerenciar-pedido-0"]').click({ delay: 1000 });
        cy.get('[data-cy="modal-gerenciar-pedido"]').should("be.visible");

        // Selecionar um novo status
        cy.get('[data-cy="dropdown-novo-status-pedido"]').click({ delay: 500 });
        cy.get('[data-cy^="dropdown-status-aprovada"]').first().click();

        // Cancelar
        cy.get('[data-cy="btn-cancelar-status-pedido"]').click({ delay: 500 });

        // Verificar se o modal fechou
        cy.get('[data-cy="modal-gerenciar-pedido"]').should("not.exist");

        // Verificar se o status não mudou
        cy.get('[data-cy="pedido-status-0"]').should("contain", statusInicial);
      });
  });

  it("Não deve permitir gerenciar pedidos com status final", () => {
    cy.visit("http://localhost:5173/admin/pedidos");
    cy.wait("@getPedidos");

    const statusFinais = ["Entregue", "Reprovada", "Trocado", "Troca Recusada"];

    // Verificar cada pedido
    cy.get('[data-cy^="pedido-status-"]').each(($el, index) => {
      const statusText = $el.text();
      const isStatusFinal = statusFinais.some((status) =>
        statusText.includes(status)
      );

      if (isStatusFinal) {
        // Verificar se o botão está desabilitado
        cy.get(`[data-cy="btn-gerenciar-pedido-${index}"]`).should(
          "have.class",
          "btn-disabled"
        );

        // Tentar clicar (não deve abrir modal)
        cy.get(`[data-cy="btn-gerenciar-pedido-${index}"]`).click({
          force: true,
        });
        cy.get('[data-cy="modal-gerenciar-pedido"]').should("not.exist");
      }
    });
  });
});
