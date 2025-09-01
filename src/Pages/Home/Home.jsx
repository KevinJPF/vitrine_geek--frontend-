import { useNavigate } from "react-router";
import { useFetchData } from "../../Hooks/useFetchData";

const Home = () => {
  const navigate = useNavigate();
  const { fetchApiData } = useFetchData("clientes");
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center container bg-blsack">
      <div className="col">
        <button
          className="btn btn-outline"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Admin
        </button>
        <button
          className="btn"
          onClick={async () => {
            const result = await fetchApiData("clientes");
            console.log(result);
            const result2 = await fetchApiData("clientes/25");
            console.log(result2);
          }}
        >
          TESTE API
        </button>
      </div>
    </div>
  );
};

export default Home;
