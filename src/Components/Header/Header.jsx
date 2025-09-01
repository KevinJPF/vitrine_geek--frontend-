import styles from "./Header.module.css";
import Input from "../Input/Input";

const Header = () => {
  return (
    <div
      className={`row align-items-center mx-2 my-2 py-1 rounded-1`}
      style={{ backgroundColor: "var(--primary)" }}
    >
      <div className="col">
        <div className="row">
          <div className={`col-auto mx-4 label ${styles.button}`}>Início</div>
          <div className={`col-auto mx-4 label ${styles.button}`}>Produtos</div>
          <div className={`col-auto mx-4 label ${styles.button}`}>Sobre</div>
          <div className={`col-auto mx-4 label ${styles.button}`}>Login</div>
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
          <div className="col-auto mx-4">Carrinho</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
