import { useStore } from "../store"
import "./ProductDetail.css"

function ProductDetail() {

  const {
    produtoSelecionado,
    setPage,
    adicionarAoCarrinho
  } = useStore()

  if (!produtoSelecionado) {
    return (
      <main className="product-detail-page">
        <div className="product-not-found">
          <h1>Produto não encontrado</h1>

          <button
            onClick={() => setPage("produtos")}
          >
            Voltar para produtos
          </button>
        </div>
      </main>
    )
  }

    const produto = produtoSelecionado

  async function comprar() {
    try {
      await adicionarAoCarrinho(produto)

      alert("Produto adicionado ao carrinho!")
    } catch (error) {
      alert(
        error.message ||
        "Não foi possível adicionar o produto ao carrinho."
      )
    }
  }

  const preco = Number(produto.preco)
    .toFixed(2)
    .replace(".", ",")

  const precoOriginal = Number(produto.precoOriginal)
    .toFixed(2)
    .replace(".", ",")

  return (
    <main className="product-detail-page">

      <div className="product-detail-container">

        <button
          className="product-back"
          onClick={() => setPage("produtos")}
        >
          ← Voltar para produtos
        </button>

        <div className="product-detail-card">

          <div className="product-detail-image-container">

            {produto.imagem ? (
              <img
                src={`http://localhost:3000/uploads/${produto.imagem}`}
                alt={produto.nome}
                className="product-detail-image"
              />
            ) : (
              <div className="product-detail-image-empty">
                CAMISA
              </div>
            )}

          </div>

          <div className="product-detail-info">

            <p className="product-detail-category">
              {produto.pais || "BRASIL"}
              {" · "}
              {produto.liga || "FUTEBOL"}
            </p>

            <h1 className="product-detail-title">
              {produto.nome}
            </h1>

            <p className="product-detail-season">
              Temporada {produto.temporada}
            </p>

            <div className="product-detail-price">

              <strong>
                R$ {preco}
              </strong>

              {produto.precoOriginal &&
                Number(produto.precoOriginal) >
                Number(produto.preco) && (
                  <span>
                    R$ {precoOriginal}
                  </span>
                )}

            </div>

            <div className="product-detail-description">

              <h3>
                Sobre o produto
              </h3>

              <p>
                {produto.descricao ||
                  "Produto oficial disponível em nossa loja."}
              </p>

            </div>

            <div className="product-detail-information">

              <div className="product-information-item">
                <span>Clube</span>
                <strong>
                  {produto.clube || "Não informado"}
                </strong>
              </div>

              <div className="product-information-item">
                <span>Marca</span>
                <strong>
                  {produto.marca || "Não informado"}
                </strong>
              </div>

              <div className="product-information-item">
                <span>Cor</span>
                <strong>
                  {produto.cor || "Não informado"}
                </strong>
              </div>

              <div className="product-information-item">
                <span>Tipo</span>
                <strong>
                  {produto.tipo || "Não informado"}
                </strong>
              </div>

              <div className="product-information-item">
                <span>Continente</span>
                <strong>
                  {produto.continente || "Não informado"}
                </strong>
              </div>

              <div className="product-information-item">
                <span>Estoque</span>
                <strong>
                  {produto.estoque} unidades
                </strong>
              </div>

            </div>

            <div className="product-detail-stock">

              {produto.estoque > 0 ? (
                <>
                  <span className="stock-dot"></span>

                  <span>
                    Produto disponível em estoque
                  </span>
                </>
              ) : (
                <span className="stock-unavailable">
                  Produto esgotado
                </span>
              )}

            </div>

            <button
              className="product-add-button"
              onClick={comprar}
              disabled={
                !produto.estoque ||
                produto.estoque <= 0
              }
            >
              {produto.estoque > 0
                ? "ADICIONAR AO CARRINHO"
                : "PRODUTO ESGOTADO"}
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}

export default ProductDetail