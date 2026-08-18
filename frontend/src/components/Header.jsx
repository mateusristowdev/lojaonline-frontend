import logo from "../assets/logo-manto-017.png"
import "./Header.css"

function Header() {
  return (
    <header className="header">

      <div className="header-logo">
        <img src={logo}></img>
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