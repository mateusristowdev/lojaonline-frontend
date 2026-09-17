import logo from "../assets/logo-manto-017.png"
import { useStore } from "../store"
import "./Header.css"

function Header() {
  const {
    usuario,
    logout,
    page,
    setPage,
    abrirCarrinho,
    quantidadeItens
  } = useStore()

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Manto 017" />
      </div>

      <nav className="header-menu">
        <button
          type="button"
          className={page === "home" ? "active" : ""}
          onClick={() => setPage("home")}
        >
          Início
        </button>

        <button
          type="button"
          className={page === "camisas" ? "active" : ""}
          onClick={() => setPage("camisas")}
        >
          Camisas
        </button>

        <button
          type="button"
          className={page === "clubes" ? "active" : ""}
          onClick={() => setPage("clubes")}
        >
          Clubes
        </button>

        <button
          type="button"
          className={page === "selecoes" ? "active" : ""}
          onClick={() => setPage("selecoes")}
        >
          Seleções
        </button>

        <button
          type="button"
          className={page === "retro" ? "active" : ""}
          onClick={() => setPage("retro")}
        >
          Retrô
        </button>

        <button
          type="button"
          className={page === "outlet" ? "active" : ""}
          onClick={() => setPage("outlet")}
        >
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
          <span>Carrinho</span>
          {quantidadeItens > 0 && (
            <span className="cart-count">{quantidadeItens}</span>
          )}
        </button>

        {usuario ? (
          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Sair
          </button>
        ) : (
          <button
            type="button"
            className="login-button"
            onClick={() => setPage("login")}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  )
}

export default Header