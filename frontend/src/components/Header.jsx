import logo from "../assets/logo-manto-017.png"
import { useStore } from "../store"
import "./Header.css"

function Header() {

  const {
    usuario,
    logout,
    setPage,
    abrirCarrinho,
    quantidadeItens
  } = useStore()

  return (
    <header className="header">

      <div className="header-logo">
        <img
          src={logo}
          alt="Manto 017"
        />
      </div>

      <nav className="header-menu">

        <button onClick={() => setPage("home")}>
          Início
        </button>

        <button onClick={() => setPage("produtos")}>
          Camisas
        </button>

        <button onClick={() => setPage("produtos")}>
          Clubes
        </button>

        <button onClick={() => setPage("produtos")}>
          Seleções
        </button>

        <button onClick={() => setPage("produtos")}>
          Retrô
        </button>

        <button onClick={() => setPage("produtos")}>
          Outlet
        </button>

      </nav>

      <div className="header-user">

        {usuario && (
          <span className="header-user-name">
            Olá, {usuario.nome}
          </span>
        )}

        <button
          type="button"
          className="cart-header-button"
          onClick={abrirCarrinho}
        >
          <span className="cart-text">
            Carrinho
          </span>

          {quantidadeItens > 0 && (
            <span className="cart-count">
              {quantidadeItens}
            </span>
          )}
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Sair
        </button>

      </div>

    </header>
  )
}

export default Header