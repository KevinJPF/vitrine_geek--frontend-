import Card from "../../Components/Card/Card";

const Home = () => {
  return (
    <div
      className="container-fluid px-2 d-flex flex-column"
      style={{ height: "calc(100vh - 82px)" }}
    >
      <Card>
        <div className="col overflow-auto h-100">Home</div>
      </Card>
    </div>
  );
};

export default Home;
