import { useStore } from "../store"
import "./CartSidebar.css"

function CartSidebar() {

  const {
    carrinho,
    carrinhoAberto,
    fecharCarrinho,
    alterarQuantidade,
    removerDoCarrinho,
    totalCarrinho,
    quantidadeItens
  } = useStore()

  if (!carrinhoAberto) {
    return null
  }

  function formatarPreco(valor) {
    return Number(valor)
      .toFixed(2)
      .replace(".", ",")
  }

  return (
    <>
      <div
        className="cart-overlay"
        onClick={fecharCarrinho}
      />

      <aside className="cart-sidebar">

        <div className="cart-header">

          <div>
            <span className="cart-label">
              SEU CARRINHO
            </span>

            <h2>
              Carrinho
            </h2>
          </div>

          <button
            className="cart-close"
            onClick={fecharCarrinho}
          >
            ×
          </button>

        </div>

        {carrinho.length === 0 ? (

          <div className="cart-empty">
            <h3>
              Seu carrinho está vazio
            </h3>

            <p>
              Adicione produtos para começar
              sua compra.
            </p>

            <button
              className="cart-continue"
              onClick={fecharCarrinho}
            >
              CONTINUAR COMPRANDO
            </button>

          </div>

        ) : (

          <>

            <div className="cart-items">

              {carrinho.map((item) => {

                const produto =
                  item.produtos

                const subtotal =
                  Number(produto.preco) *
                  Number(item.quantidade)

                return (

                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <div className="cart-item-image">

                      {produto.imagem ? (

                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                        />

                      ) : (

                        <span>
                          CAMISA
                        </span>

                      )}

                    </div>

                    <div className="cart-item-content">

                      <div className="cart-item-top">

                        <div>

                          <span className="cart-item-category">
                            {produto.clube ||
                              produto.pais ||
                              "FUTEBOL"}
                          </span>

                          <h3>
                            {produto.nome}
                          </h3>

                        </div>

                        <button
                          className="cart-remove"
                          onClick={() =>
                            removerDoCarrinho(
                              item.id
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                      <strong className="cart-item-price">
                        R$ {formatarPreco(
                          produto.preco
                        )}
                      </strong>

                      <div className="cart-item-bottom">

                        <div className="quantity-control">

                          <button
                            onClick={() => {

                              if (
                                item.quantidade > 1
                              ) {
                                alterarQuantidade(
                                  item.id,
                                  item.quantidade - 1
                                )
                              }

                            }}
                            disabled={
                              item.quantidade <= 1
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantidade}
                          </span>

                          <button
                            onClick={() => {

                              if (
                                item.quantidade <
                                produto.estoque
                              ) {
                                alterarQuantidade(
                                  item.id,
                                  item.quantidade + 1
                                )
                              }

                            }}
                            disabled={
                              item.quantidade >=
                              produto.estoque
                            }
                          >
                            +
                          </button>

                        </div>

                        <strong className="cart-item-subtotal">
                          R$ {formatarPreco(
                            subtotal
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>

                )
              })}

            </div>

            <div className="cart-footer">

              <div className="cart-summary">

                <div>
                  <span>
                    Produtos
                  </span>

                  <span>
                    {quantidadeItens}
                  </span>
                </div>

                <div className="cart-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    R$ {formatarPreco(
                      totalCarrinho
                    )}
                  </strong>

                </div>

              </div>

              <button
                className="cart-checkout"
                onClick={() => {
                  fecharCarrinho()
                }}
              >
                FINALIZAR COMPRA
              </button>

            </div>

          </>

        )}

      </aside>
    </>
  )
}

export default CartSidebar