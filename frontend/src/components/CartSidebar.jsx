import { useStore } from "../store"

function CartSidebar() {
  const {
    carrinho,
    carrinhoAberto,
    fecharCarrinho,
    removerDoCarrinho
  } = useStore()

  if (!carrinhoAberto) {
    return null
  }

  return (
    <aside className="cart-sidebar">

      <button onClick={fecharCarrinho}>
        Fechar
      </button>

      <h2>
        Carrinho
      </h2>

      {carrinho.length === 0 ? (
        <p>
          Seu carrinho está vazio.
        </p>
      ) : (
        carrinho.map((produto) => (
          <div key={produto.id}>

            <p>
              {produto.nome}
            </p>

            <button
              onClick={() =>
                removerDoCarrinho(produto.id)
              }
            >
              Remover
            </button>

          </div>
        ))
      )}

    </aside>
  )
}

export default CartSidebar