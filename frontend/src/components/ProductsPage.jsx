import { useEffect, useMemo, useState } from "react"
import { useStore } from "../store"
import { apiFetch } from "../services/api"
import "./ProductsPage.css"

const CONFIG_CATEGORIAS = {
  camisas: {
    titulo: "CAMISAS",
    descricao: "Todos os modelos de camisas"
  },
  clubes: {
    titulo: "CLUBES",
    descricao: "Camisas de clubes"
  },
  selecoes: {
    titulo: "SELEÇÕES",
    descricao: "Camisas de seleções"
  },
  retro: {
    titulo: "RETRÔ",
    descricao: "Camisas retrô"
  },
  outlet: {
    titulo: "OUTLET",
    descricao: "Camisas em promoção"
  }
}

function normalizarTexto(valor) {
  return String(valor || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function ehSelecao(produto) {
  const texto = `${produto.tipo || ""} ${produto.clube || ""} ${produto.pais || ""} ${produto.liga || ""} ${produto.nome || ""}`
  return normalizarTexto(texto).includes("selecao")
}

function ehRetro(produto) {
  const texto = `${produto.tipo || ""} ${produto.nome || ""} ${produto.temporada || ""}`
  return normalizarTexto(texto).includes("retro")
}

function pertenceCategoria(produto, categoria) {
  if (categoria === "camisas") {
    return true
  }

  if (categoria === "selecoes") {
    return ehSelecao(produto)
  }

  if (categoria === "clubes") {
    return !ehSelecao(produto) && normalizarTexto(produto.clube) !== ""
  }

  if (categoria === "retro") {
    return ehRetro(produto)
  }

  if (categoria === "outlet") {
    const preco = Number(produto.preco)
    const precoOriginal = Number(produto.precoOriginal)

    return precoOriginal > preco
  }

  return true
}

function ProductsPage({ categoria = "camisas" }) {
  const { setPage, setProdutoSelecionado } = useStore()
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const config = CONFIG_CATEGORIAS[categoria] || CONFIG_CATEGORIAS.camisas

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setCarregando(true)
        setErro("")

        const dados = await apiFetch("/produtos")

        console.log("PRODUTOS:", dados)

        setProdutos(Array.isArray(dados) ? dados : [])
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setErro(error.message || "Erro ao carregar produtos")
      } finally {
        setCarregando(false)
      }
    }

    carregarProdutos()
  }, [])

  const produtosFiltrados = useMemo(() => {
    const filtrados = produtos.filter(produto =>
      pertenceCategoria(produto, categoria)
    )

    if (categoria === "outlet") {
      console.table(
        produtos.map(produto => ({
          nome: produto.nome,
          preco: produto.preco,
          precoOriginal: produto.precoOriginal,
          outlet: pertenceCategoria(produto, "outlet")
        }))
      )
    }

    return filtrados
  }, [produtos, categoria])

  function abrirProduto(produto) {
    setProdutoSelecionado(produto)
    setPage("produto")
  }

  function formatarPreco(valor) {
    return Number(valor || 0).toFixed(2).replace(".", ",")
  }

  return (
    <main>
      <section className="products-page">
        <div className="section-header">
          <div>
            <p>CATÁLOGO</p>
            <h1>{config.titulo}</h1>
            <span>{config.descricao}</span>
          </div>

          <button
            className="see-all"
            onClick={() => setPage("home")}
          >
            ← Voltar
          </button>
        </div>

        {carregando && <p>Carregando produtos...</p>}

        {erro && <p>{erro}</p>}

        {!carregando && !erro && produtosFiltrados.length > 0 && (
          <div className="products-grid">
            {produtosFiltrados.map(produto => (
              <div
                className="product-card"
                key={produto.id}
                onClick={() => abrirProduto(produto)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image">
                  {produto.imagem ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${produto.imagem}`}
                      alt={produto.nome}
                    />
                  ) : (
                    "CAMISA"
                  )}
                </div>

                <div className="product-info">
                  <p>
                    {produto.pais || "BRASIL"} · {produto.liga || "FUTEBOL"}
                  </p>

                  <h3>{produto.nome}</h3>

                  <span>{produto.temporada || ""}</span>

                  <strong>
                    R$ {formatarPreco(produto.preco)}
                  </strong>

                  {Number(produto.precoOriginal || 0) > Number(produto.preco || 0) && (
                    <small>
                      De R$ {formatarPreco(produto.precoOriginal)}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!carregando && !erro && produtosFiltrados.length === 0 && (
          <p>Nenhum produto encontrado nesta categoria.</p>
        )}
      </section>
    </main>
  )
}

export default ProductsPage