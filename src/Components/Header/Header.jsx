import styles from "./Header.module.css";
import Input from "../Input/Input";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div
      className={`row align-items-center mx-2 my-2 py-1 rounded-1`}
      style={{ backgroundColor: "var(--primary)" }}
    >
      <div className="col">
        <div className="row">
          <div
            className={`col-auto mx-4 label ${styles.button}`}
            onClick={() => {
              navigate("/");
            }}
          >
            Início
          </div>
          <div
            className={`col-auto mx-4 label ${styles.button}`}
            onClick={() => {
              navigate("/produtos");
            }}
          >
            Produtos
          </div>
          <div
            className={`col-auto mx-4 label ${styles.button}`}
            onClick={() => {
              navigate("/sobre");
            }}
          >
            Sobre
          </div>
          <div
            className={`col-auto mx-4 label ${styles.button}`}
            onClick={() => {
              navigate("/admin/dashboard");
            }}
          >
            Login
          </div>
        </div>
      </div>
      <div className={`col-auto mx-4 text-center rounded-1 ${styles.logo}`}>
        Vitrine Geek
      </div>
      <div className="col">
        <div className="row justify-content-end">
          <div className="col-auto p-0">
            <Input />
          </div>
          <div
            className={`col-auto mx-4 ${styles.cart_button}`}
            onClick={() => navigate("/carrinho")}
          >
            <FontAwesomeIcon icon={faShoppingBasket} />
            <span className={`badge ${styles.cart_badge}`}>3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
