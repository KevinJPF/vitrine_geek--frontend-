import { useLocation, useNavigate } from "react-router";
import styles from "./SideMenu.module.css";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`col h-100 ${styles.main_container}`}>
      <div
        className="row p-2 justify-content-center"
        style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}
      >
        MENU
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/dashboard") ? styles.active : ""
        }`}
        onClick={() => !isActive("/dashboard") && navigate("/dashboard")}
      >
        Dashboard
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/clientes") ? styles.active : ""
        }`}
        onClick={() => !isActive("/clientes") && navigate("/clientes")}
      >
        Clientes
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/produtos") ? styles.active : ""
        }`}
        onClick={() => !isActive("/produtos") && navigate("/produtos")}
      >
        Produtos
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/pedidos") ? styles.active : ""
        }`}
        onClick={() => !isActive("/pedidos") && navigate("/pedidos")}
      >
        Pedidos
      </div>
      {/* <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/logs") ? styles.active : ""
        }`}
      >
        Logs de Transação
      </div> */}
    </div>
  );
};

export default SideMenu;
