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
          isActive("/admin/dashboard") ? styles.active : ""
        }`}
        onClick={() =>
          !isActive("/admin/dashboard") && navigate("/admin/dashboard")
        }
      >
        Dashboard
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/admin/clientes") ? styles.active : ""
        }`}
        onClick={() =>
          !isActive("/admin/clientes") && navigate("/admin/clientes")
        }
      >
        Clientes
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/admin/produtos") ? styles.active : ""
        }`}
        onClick={() =>
          !isActive("/admin/produtos") && navigate("/admin/produtos")
        }
      >
        Produtos
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/admin/pedidos") ? styles.active : ""
        }`}
        onClick={() =>
          !isActive("/admin/pedidos") && navigate("/admin/pedidos")
        }
      >
        Pedidos
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${
          isActive("/admin/logs") ? styles.active : ""
        }`}
        onClick={() => !isActive("/admin/logs") && navigate("/admin/logs")}
      >
        Logs de Transação
      </div>
      <div
        className={`row p-2 ${styles.menu_item} ${styles.exit}`}
        onClick={() => !isActive("/") && navigate("/")}
      >
        Voltar
      </div>
    </div>
  );
};

export default SideMenu;
