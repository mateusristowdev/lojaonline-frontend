import logo from "../assets/logo-manto-017.png";
import { useStore } from "../store";
import "./Header.css";

function Header() {
  const { usuario, logout } = useStore();

  return (
    <header className="header">

      <div className="header-logo">
        <img src={logo} alt="Manto 017" />
      </div>

      <nav className="header-menu">
        <button>Início</button>
        <button>Camisas</button>
        <button>Clubes</button>
        <button>Seleções</button>
        <button>Retrô</button>
        <button>Outlet</button>
      </nav>

      <div className="header-user">
        {usuario && (
          <span className="header-user-name">
            Olá, {usuario.nome}
          </span>
        )}
        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;