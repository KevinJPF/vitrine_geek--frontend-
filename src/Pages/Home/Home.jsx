import { useNavigate } from "react-router";
import { useGetData } from "../../Hooks/useGetData";

const Home = () => {
  const navigate = useNavigate();
  const { getApiData } = useGetData("clientes");
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
            const result = await getApiData("clientes");
            console.log(result);
            const result2 = await getApiData("clientes/25");
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
