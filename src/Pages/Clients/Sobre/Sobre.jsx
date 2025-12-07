import React from "react";
import Card from "../../../Components/Card/Card";

const Sobre = () => {
  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card cardName={"Sobre o Projeto"}>
        <div
          className="col overflow-auto h-100 p-3"
          style={{ textAlign: "justify", color: "var(--secondary)" }}
        >
          <p>
            Este sistema foi desenvolvido em 2025 por{" "}
            <strong>Kevin Juliano Pires Francisco </strong>
            como projeto acadêmico para a disciplina de{" "}
            <strong>Laboratório de Engenharia de Software(LES) </strong>
            da <strong>FATEC Mogi das Cruzes</strong>, ministrada pelo professor
            <strong> Rodrigo Rocha Silva</strong>.
          </p>

          <p>
            O projeto consiste em um e-commerce de produtos personalizados com
            temática geek, cujo objetivo é demonstrar a capacidade do aluno em
            conceber e implementar uma aplicação completa, abrangendo desde o
            backend até o frontend.
          </p>

          <p>
            A solução utiliza uma API construída em{" "}
            <strong>Node.js com TypeScript</strong> para realizar a integração
            com o banco de dados <strong>MySQL</strong>, assegurando comunicação
            eficiente e estruturada entre as camadas do sistema. No frontend,
            desenvolvido em
            <strong> JavaScript com ReactJS</strong> e apoiado pelo framework{" "}
            <strong>Bootstrap</strong>, é apresentada a interface utilizada
            pelos usuários.
          </p>

          <p>
            Além disso, o projeto incorpora recursos de{" "}
            <strong>inteligência artificial</strong> por meio da integração com
            o <strong>ChatGPT</strong>, permitindo recomendações de produtos via
            chatbot desenvolvido pelo aluno.
          </p>

          <p>
            O resultado final busca evidenciar o domínio das tecnologias
            envolvidas, as boas práticas de engenharia de software e a
            capacidade de aplicar conceitos teóricos em um sistema funcional e
            coerente com as demandas do mercado.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Sobre;
