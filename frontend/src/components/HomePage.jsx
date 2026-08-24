import logo from "../assets/logo-manto-017.png"
import { useEffect, useState } from "react"
import "./HomePage.css"

function Home() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function visualizarProdutos() {
      try {
        const response = await fetch("http://localhost:3000/produtos")

        if (!response.ok) {
          throw new Error("Erro ao visualizar produtos")
        }

        const dados = await response.json()

        setProdutos(dados)
      } catch (error) {
        console.error(error)
        setErro("Não foi possível carregar os produtos.")
      }
    }

    visualizarProdutos()
  })

  return (
    <div className="home">

      <main>

        <section className="home-banner">

          <div className="banner-content">

            <p className="banner-small">
              O MANTO DO SEU TIME
            </p>

            <h1>
              VISTA A<br />
              <span>PAIXÃO.</span>
            </h1>

            <p className="banner-description">
              Camisas oficiais, retrôs e muito mais.
              Encontre o manto que representa você.
            </p>

            <button className="banner-button">
              VER CAMISAS
            </button>

          </div>

        </section>

        <section className="home-products">

          <div className="section-header">

            <div>
              <p>DESTAQUES</p>

              <h2>
                MAIS VENDIDOS
              </h2>
            </div>

            <button className="see-all">
              Ver todos →
            </button>

          </div>

          <div className="products-grid">

            <div className="product-card">
              <div className="product-image flamengo">
                CAMISA
              </div>

              <div className="product-info">
                <p>BRASIL · BRASILEIRÃO</p>

                <h3>Flamengo</h3>

                <span>2024/25</span>

                <strong>
                  R$ 299,90
                </strong>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image palmeiras">
                CAMISA
              </div>

              <div className="product-info">
                <p>BRASIL · BRASILEIRÃO</p>

                <h3>Palmeiras</h3>

                <span>2024/25</span>

                <strong>
                  R$ 299,90
                </strong>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image corinthians">
                CAMISA
              </div>

              <div className="product-info">
                <p>BRASIL · BRASILEIRÃO</p>

                <h3>Corinthians</h3>

                <span>2024/25</span>

                <strong>
                  R$ 289,90
                </strong>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image brasil">
                CAMISA
              </div>

              <div className="product-info">
                <p>BRASIL · SELEÇÃO</p>

                <h3>Seleção Brasileira</h3>

                <span>2024/25</span>

                <strong>
                  R$ 349,90
                </strong>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Home