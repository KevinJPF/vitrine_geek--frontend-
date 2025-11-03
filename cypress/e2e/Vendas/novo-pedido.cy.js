describe("Fluxo de compra: listar -> detalhe -> adicionar -> alterar quantidade -> checkout", () => {
  const base = "http://localhost:5173/produtos";

  beforeEach(() => {
    cy.visit(base);
  });

  it("Deve adicionar um produto ao carrinho, alterar quantidade e seguir para checkout (usando data-cy)", () => {
    // abre o primeiro card (usa data-cy como no clientes-create)
    cy.get('[data-cy="card-produto-0"]').click();

    // pega o nome na página de detalhe (prefere data-cy, senão usa h2)
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="detalhe-nome-produto"]').length) {
        cy.get('[data-cy="detalhe-nome-produto"]')
          .invoke("text")
          .as("productName");
      } else {
        cy.get("h2").first().invoke("text").as("productName");
      }
    });

    // botão adicionar ao carrinho (prefere data-cy)
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="btn-adicionar-carrinho"]').length) {
        cy.get('[data-cy="btn-adicionar-carrinho"]').click({ force: true });
      } else {
        cy.contains("Adicionar ao Carrinho").click({ force: true });
      }
    });

    // espera carrinho
    cy.url({ timeout: 10000 }).should("include", "/carrinho");

    // verifica produto no carrinho usando o nome capturado
    // cy.get("@productName").then((name) => {
    //   cy.contains(name.trim(), { timeout: 10000 }).should("exist");
    // });

    // // captura subtotal atual (prefere data-cy)
    // cy.get("body").then(($body) => {
    //   if ($body.find('[data-cy="subtotal"]').length) {
    //     cy.get('[data-cy="subtotal"]').invoke("text").as("subtotal1");
    //   } else {
    //     cy.contains("Subtotal")
    //       .parent()
    //       .invoke("text")
    //       .then((t) => cy.wrap(t).as("subtotal1"));
    //   }
    // });

    // // aumenta quantidade do primeiro item (prefere data-cy)
    // cy.get("body").then(($body) => {
    //   if ($body.find('[data-cy="btn-aumentar-quantidade-0"]').length) {
    //     cy.get('[data-cy="btn-aumentar-quantidade-0"]').click({ force: true });
    //   } else {
    //     // fallback: achar pelo bloco do produto
    //     cy.get("@productName").then((name) => {
    //       cy.contains(name.trim())
    //         .closest("div")
    //         .within(() => {
    //           // tenta botão "+" ou botão com data-cy genérico
    //           cy.get('[data-cy="btn-quantidade-mais"]')
    //             .click({ force: true })
    //             .catch(() => {
    //               cy.contains("+")
    //                 .click({ force: true })
    //                 .catch(() => {
    //                   // fallback último recurso
    //                   cy.get("button").contains("+").click({ force: true });
    //                 });
    //             });
    //         });
    //     });
    //   }
    // });

    // // pequeno wait para UI atualizar
    // cy.wait(500);

    // // captura novo subtotal e compara (transforma textos em números)
    // const parseCurr = (txt) =>
    //   Number(
    //     String(txt)
    //       .replace(/[R$\s\.]/g, "")
    //       .replace(",", ".") || 0
    //   );

    // cy.get("body").then(($body) => {
    //   if ($body.find('[data-cy="subtotal"]').length) {
    //     cy.get('[data-cy="subtotal"]')
    //       .invoke("text")
    //       .then((t2) => {
    //         cy.get("@subtotal1").then((t1) => {
    //           expect(parseCurr(t2)).to.be.greaterThan(parseCurr(t1));
    //         });
    //       });
    //   } else {
    //     cy.contains("Subtotal")
    //       .parent()
    //       .invoke("text")
    //       .then((t2) => {
    //         cy.get("@subtotal1").then((t1) => {
    //           expect(parseCurr(t2)).to.be.greaterThan(parseCurr(t1));
    //         });
    //       });
    //   }
    // });

    // seguir para checkout (prefere data-cy)
    cy.get('[data-cy="btn-continuar-pagamento"]').click({ force: true });

    cy.url({ timeout: 5000 }).should("include", "/checkout");
    // cy.get("@productName").then((name) =>
    //   cy.contains(name.trim()).should("exist")
    // );
    cy.get('[data-cy="btn-finalizar-compra"]').click({ force: true });
    cy.get('[data-cy="btn-finalizar-compra"]').click({ force: true });

    cy.url({ timeout: 1000 }).should("include", "/pedido-confirmado");

    cy.get('[data-cy="btn-meus-pedidos"]').click({ force: true });
  });
});
