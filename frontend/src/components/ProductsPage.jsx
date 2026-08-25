import { useEffect, useState } from "react"
import { useStore } from "../store"
import { apiFetch } from "../services/api"

function ProductsPage() {

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
        const dados =
          await apiFetch("/produtos")
        setProdutos(dados)
      } catch (error) {
        console.error(
          "Erro ao carregar produtos:",
          error
        )
        setErro(
          error.message ||
          "Erro ao carregar produtos"
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
    <main>
      <section className="products-page">

        <div className="section-header">
          <div>
            <p>
              CATÁLOGO
            </p>
            <h1>
              PRODUTOS
            </h1>
          </div>

          <button
            className="see-all"
            onClick={() => setPage("home")}
          >
            ← Voltar
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
          !erro && (
            
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
              Nenhum produto encontrado.
            </p>

          )}

      </section>

    </main>

  )

}


export default ProductsPage