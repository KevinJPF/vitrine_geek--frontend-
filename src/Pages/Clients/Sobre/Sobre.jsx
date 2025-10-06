import React from "react";
import Card from "../../../Components/Card/Card";

const Sobre = () => {
  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col overflow-auto h-100">Sobre</div>
      </Card>
    </div>
  );
};

export default Sobre;
