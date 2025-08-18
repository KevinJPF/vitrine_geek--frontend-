import { Navigate, useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="col d-flex flex-column justify-content-center align-items-center container bg-blsack">
      <div className="col-auto">
        <p style={{ color: "var(--highlight)" }}>Vitrine Geek</p>
      </div>
      <div className="col">
        <button
          className="btn btn-outline"
          onClick={() => {
            navigate("/clientes");
          }}
        >
          Clientes
        </button>
      </div>
    </div>
  );
};

export default Home;
