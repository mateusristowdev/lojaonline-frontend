import { useStore } from "../store"
import "./HomePage.css"

function HomePage() {
  const { usuario, logout } = useStore()

  return (
    <main className="home-page">

      <section className="home-hero">

        <div className="home-content">

          <span className="home-tag">
            MANTO 017
          </span>

          <h1>
            Vista a paixão pelo futebol.
          </h1>

          <p>
            Camisas, produtos e acessórios
            para quem vive o futebol.
          </p>

          <button className="home-button">
            Ver produtos
          </button>

        </div>

      </section>

      <section className="home-welcome">

        <h2>
          Bem-vindo à MANTO 017
        </h2>

        {usuario && (
          <p>
            Olá, {usuario.nome || usuario.email}!
          </p>
        )}

        <button
          className="logout-button"
          onClick={logout}
        >
          Sair da conta
        </button>

      </section>

    </main>
  )
}

export default HomePage