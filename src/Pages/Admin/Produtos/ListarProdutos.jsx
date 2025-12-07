import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGetData } from "../../../Hooks/useGetData";
import { usePatchData } from "../../../Hooks/usePatchData";

const ListarProdutos = () => {
  const navigate = useNavigate();
  const { getApiData } = useGetData();
  const { patchApiData } = usePatchData();
  const [produtos, setProdutos] = useState([
    {
      nome: "Camiseta Geek",
      categoria: "Roupas",
      preco: 79.9,
      descricao: "Camiseta com estampa exclusiva do universo geek.",
      imagens: ["camiseta1.jpg"],
      opcoesPersonalizacao: ["Tamanho", "Cor"],
      grupoPrecificacao: "Roupas",
      codigoBarras: "1234567890123",
      ativo: true,
    },
    {
      nome: "Caneca Gamer",
      categoria: "Utilidades",
      preco: 39.9,
      descricao: "Caneca personalizada para gamers.",
      imagens: ["caneca1.jpg"],
      opcoesPersonalizacao: ["Cor"],
      grupoPrecificacao: "Acessórios",
      codigoBarras: "9876543210987",
      ativo: true,
    },
    {
      nome: "Action Figure",
      categoria: "Colecionáveis",
      preco: 249.9,
      descricao: "Action Figure detalhada de personagem famoso.",
      imagens: ["figure1.jpg"],
      opcoesPersonalizacao: [],
      grupoPrecificacao: "Colecionáveis",
      codigoBarras: "4561237896541",
      ativo: false,
    },
  ]);

  const fetchProdutos = async () => {
    const result = await getApiData("produtos");
    console.log(result);
    setProdutos(result);
  };

  const alterarStatusProduto = (produtoParaAlterar) => {
    setProdutos(
      produtos.map((produto) => {
        if (produto === produtoParaAlterar) produto.ativo = !produto.ativo;
        return produto;
      })
    );
  };

  useEffect(() => {
    fetchProdutos();
    const novoProduto = localStorage.getItem("novoProduto");
    const editProduto = localStorage.getItem("editProduto");
    const index = localStorage.getItem("indexProduto");

    if (editProduto && index !== null) {
      setProdutos((old) => {
        const updated = [...old];
        updated[index] = JSON.parse(editProduto);
        return updated;
      });
      localStorage.removeItem("editProduto");
      localStorage.removeItem("indexProduto");
    }

    if (novoProduto) {
      setProdutos((old) => [...old, JSON.parse(novoProduto)]);
      localStorage.removeItem("novoProduto");
    }
  }, []);

  return (
    <div className="container d-flex flex-column min-vh-100">
      <div className="col-auto p-2 d-flex flex-row justify-content-center align-items-center">
        <p className="m-0" style={{ color: "var(--highlight" }}>
          Produtos
        </p>
      </div>
      <div
        className={`col my-2 rounded-4 d-flex flex-column shadow`}
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--white)",
        }}
      >
        {/* Cabeçalho da tabela */}
        <div
          className="row"
          style={{
            backgroundColor: "var(--highlight)",
            color: "var(--secondary)",
            borderBottom: "2px solid var(--secondary)",
            borderRadius: "16px 16px 0px 0px",
          }}
        >
          <div className="col-2 d-flex justify-content-center">Nome</div>
          <div className="col-1 d-flex justify-content-center">Estoque</div>
          <div className="col-2 d-flex justify-content-center">
            Categoria(s)
          </div>
          <div className="col-3 d-flex justify-content-center">Descrição</div>
          <div className="col-1 d-flex justify-content-center">Preço</div>
          <div className="col-1 d-flex justify-content-center">Ativo</div>
          <div className="col-2 d-flex justify-content-center">Ação</div>
        </div>

        {/* Corpo da tabela */}
        <div
          className="col overflow-auto"
          style={{
            borderRadius: "0px 0px 16px 16px",
          }}
        >
          {produtos.map((produto, index) => {
            return (
              <div
                key={index}
                className="row py-2"
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff10" : "#ffffff1f",
                  borderBottom: "2px solid var(--secondary)",
                  color: "var(--secondary)",
                }}
              >
                <div
                  className="col-2 text-truncate"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {produto.nome_produto}
                </div>
                <div
                  className="col-1 d-flex text-truncate justify-content-center"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {produto.quantidade_disponivel}
                </div>
                <div
                  className="col-2"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  {produto.categorias &&
                    produto.categorias.map((categoria, idx) => (
                      <span key={idx}>
                        {idx > 0 ? ", " : ""}
                        {categoria.nome}
                      </span>
                    ))}
                </div>
                <div
                  className="col-3 text-truncate"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                  title={produto.descricao}
                >
                  {produto.descricao}
                </div>
                <div
                  className="col-1"
                  style={{ borderRight: "2px solid var(--secondary)" }}
                >
                  R$ {produto.valor_venda}
                </div>
                <div
                  className="col-1 d-flex justify-content-center"
                  style={{
                    color: produto.ativo ? "var(--green)" : "var(--red)",
                    borderRight: "2px solid var(--secondary)",
                  }}
                >
                  {produto.ativo ? "✓" : "x"}
                </div>
                <div className="col-2 gap-2 d-flex justify-content-center">
                  <button
                    className="btn btn-inverted"
                    onClick={() => {
                      localStorage.setItem("indexProduto", index);
                      navigate(`/admin/registrar-produto/${produto.id}`, {
                        state: { produto },
                      });
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className={`btn ${
                      produto.ativo ? "btn-danger" : "btn-green"
                    }`}
                    onClick={async () => {
                      if (
                        (
                          await patchApiData(
                            `produtos/${
                              produto.ativo ? "desativar" : "ativar"
                            }`,
                            produto.id
                          )
                        ).status === 200
                      )
                        alterarStatusProduto(produto);
                    }}
                  >
                    {produto.ativo ? "Desativar" : "Ativar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botões inferiores */}
      <div className="col-auto d-flex justify-content-end py-2">
        <button
          className="btn"
          onClick={() => navigate("/admin/registrar-produto")}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default ListarProdutos;
