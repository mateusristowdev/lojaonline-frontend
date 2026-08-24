import { useStore } from "../store"

function ProductDetail() {

  const {
    produtoSelecionado,
    setPage,
    adicionarAoCarrinho
  } = useStore()

  if (!produtoSelecionado) {
    return (
      <main>

        <h1>
          Produto não encontrado
        </h1>

        <button
          onClick={() => setPage("produtos")}
        >
          Voltar para produtos
        </button>

      </main>
    )
  }

  const produto = produtoSelecionado

  function comprar() {
    adicionarAoCarrinho(produto)

    alert("Produto adicionado ao carrinho!")
  }

  return (
    <main>

      <section className="product-detail">

        <button
          onClick={() => setPage("produtos")}
        >
          ← Voltar para produtos
        </button>

        <div className="product-detail-content">

          <div className="product-detail-image">

            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
              />
            ) : (
              "CAMISA"
            )}

          </div>

          <div className="product-detail-info">

            <p>
              {produto.pais || "BRASIL"}
              {" · "}
              {produto.liga || "FUTEBOL"}
            </p>

            <h1>
              {produto.nome}
            </h1>

            <span>
              {produto.temporada}
            </span>

            <h2>
              R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
            </h2>

            {produto.precoOriginal && (
              <p>
                De: R$ {Number(produto.precoOriginal).toFixed(2).replace(".", ",")}
              </p>
            )}

            <p>
              {produto.descricao || "Produto oficial disponível em nossa loja."}
            </p>

            <p>
              Marca: {produto.marca || "Não informado"}
            </p>

            <p>
              Cor: {produto.cor || "Não informado"}
            </p>

            <p>
              Estoque: {produto.estoque}
            </p>

            <button
              onClick={comprar}
              disabled={!produto.estoque || produto.estoque <= 0}
            >
              {produto.estoque > 0
                ? "Adicionar ao carrinho"
                : "Produto esgotado"}
            </button>

          </div>

        </div>

      </section>

    </main>
  )
}

export default ProductDetail