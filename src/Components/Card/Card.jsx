import React from "react";
import SectionHeader from "../Card/SectionHeader";

const Card = ({ children, cardName }) => {
  return (
    <div
      className={`col rounded-1 d-flex flex-column shadow overflow-hidden`}
      style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}
    >
      <div className="col overflow-hidden">
        {/* Card Name */}
        {cardName && <SectionHeader titulo={cardName} />}
        <div className="col h-100 px-2 py-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default Card;
