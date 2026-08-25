import { useEffect, useState } from "react"
import { useStore } from "../store"
import { apiFetch } from "../services/api"
import "./HomePage.css"

function Home() {
  const {
    setPage,
    setProdutoSelecionado
  } = useStore()

  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setCarregando(true)
        setErro("")

        const dados = await apiFetch(
          "/produtos/destaques"
        )

        setProdutos(dados)
      } catch (error) {
        console.error(
          "Erro ao carregar produtos:",
          error
        )
        setErro(
          error.message ||
          "Não foi possível carregar os produtos."
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarProdutos()
  }, [])


  function abrirProduto(produto) {
    setProdutoSelecionado(produto)
    setPage("produto")
  }


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


            <button
              className="banner-button"
              onClick={() => setPage("produtos")}
            >
              VER CAMISAS
            </button>

          </div>

        </section>

        <section className="home-products">


          <div className="section-header">

            <div>

              <p>
                DESTAQUES
              </p>

              <h2>
                MAIS VENDIDOS
              </h2>

            </div>


            <button
              className="see-all"
              onClick={() => setPage("produtos")}
            >
              Ver todos →
            </button>

          </div>

          {carregando && (

            <p>
              Carregando produtos...
            </p>

          )}

          {erro && (

            <p>
              {erro}
            </p>

          )}

          {!carregando &&
            !erro &&
            produtos.length > 0 && (

              <div className="products-grid">

                {produtos.map((produto) => (

                  <div
                    className="product-card"
                    key={produto.id}
                    onClick={() =>
                      abrirProduto(produto)
                    }
                    style={{
                      cursor: "pointer"
                    }}
                  >
                    <div className="product-image">

                      {produto.imagem ? (

                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                        />

                      ) : (

                        "CAMISA"

                      )}

                    </div>

                    <div className="product-info">


                      <p>

                        {produto.pais ||
                          "BRASIL"}

                        {" · "}

                        {produto.liga ||
                          "FUTEBOL"}

                      </p>


                      <h3>
                        {produto.nome}
                      </h3>


                      <span>
                        {produto.temporada || ""}
                      </span>


                      <strong>

                        R${" "}

                        {Number(
                          produto.preco
                        )
                          .toFixed(2)
                          .replace(".", ",")}

                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {!carregando &&
            !erro &&
            produtos.length === 0 && (
              <p>
                Nenhum produto em destaque.
              </p>
            )}
        </section>
      </main>
    </div>
  )
}

export default Home