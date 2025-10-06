import React from "react";

const SectionHeader = ({ titulo }) => {
  return (
    <div
      className="row justify-content-center"
      style={{
        backgroundColor: "var(--highlight)",
        borderBottom: "2px solid var(--secondary)",
        color: "var(--secondary)",
      }}
    >
      {titulo}
    </div>
  );
};

export default SectionHeader;
