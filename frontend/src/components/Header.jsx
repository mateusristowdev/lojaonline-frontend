import logo from "../assets/logo-manto-017.jpeg"
import "./Header.css"

function Header() {
  return (
    <header className="header">

      <div className="header-logo">
        <img
          src="logo-manto-017.jpeg"
          alt="MANTO 017"
        />
      </div>

      <nav className="header-menu">
        <button>Início</button>
        <button>Camisas</button>
        <button>Clubes</button>
        <button>Seleções</button>
        <button>Retrô</button>
        <button>Outlet</button>
      </nav>
    </header>
  )
}

export default Header