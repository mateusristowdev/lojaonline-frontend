import { useEffect, useState } from "react"
import { useStore } from "../store"
import "./CartSidebar.css"

function CartSidebar() {
  const {
    carrinho,
    carrinhoAberto,
    fecharCarrinho,
    alterarQuantidade,
    removerDoCarrinho,
    quantidadeItens,
    setPage,
    cupom,
    cupomAplicado,
    aplicarCupom,
    removerCupom,
    descontoCupom,
    totalComDesconto
  } = useStore()

  const [cupomInput, setCupomInput] = useState(cupom || "")
  const [mensagemCupom, setMensagemCupom] = useState("")

  useEffect(() => {
    setCupomInput(cupom || "")
  }, [cupom])

  if (!carrinhoAberto) {
    return null
  }

  function formatarPreco(valor) {
    return Number(valor || 0)
      .toFixed(2)
      .replace(".", ",")
  }

  function aplicarCupomCarrinho() {
    const codigo = cupomInput.trim().toUpperCase()

    if (!codigo) {
      setMensagemCupom("Digite um cupom.")
      return
    }

    const sucesso = aplicarCupom(codigo)

    if (sucesso) {
      setMensagemCupom("Cupom aplicado com sucesso!")
    } else {
      setMensagemCupom("Cupom inválido.")
    }
  }

  function removerCupomCarrinho() {
    removerCupom()
    setCupomInput("")
    setMensagemCupom("")
  }

  function irParaCheckout() {
    if (!carrinho.length) return

    fecharCarrinho()
    setPage("checkout")
  }

  const subtotal = carrinho.reduce(
    (total, item) =>
      total +
      Number(item.produtos.preco) *
        Number(item.quantidade),
    0
  )

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

            <h2>Carrinho</h2>
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
            <h3>Seu carrinho está vazio</h3>

            <p>
              Adicione produtos para começar sua compra.
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
              {carrinho.map(item => {
                const produto = item.produtos

                const subtotalItem =
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
                          src={`${import.meta.env.VITE_API_URL}/uploads/${produto.imagem}`}
                          alt={produto.nome}
                        />
                      ) : (
                        <span>CAMISA</span>
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

                          <h3>{produto.nome}</h3>
                        </div>

                        <button
                          className="cart-remove"
                          onClick={() =>
                            removerDoCarrinho(item.id)
                          }
                        >
                          ×
                        </button>
                      </div>

                      <strong className="cart-item-price">
                        R$ {formatarPreco(produto.preco)}
                      </strong>

                      <div className="cart-item-bottom">
                        <div className="quantity-control">
                          <button
                            onClick={() => {
                              if (item.quantidade > 1) {
                                alterarQuantidade(
                                  item.id,
                                  item.quantidade - 1
                                )
                              }
                            }}
                            disabled={item.quantidade <= 1}
                          >
                            −
                          </button>

                          <span>{item.quantidade}</span>

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
                          R$ {formatarPreco(subtotalItem)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-coupon">
              <label>Cupom de desconto</label>

              {!cupomAplicado ? (
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    value={cupomInput}
                    onChange={e =>
                      setCupomInput(e.target.value)
                    }
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        aplicarCupomCarrinho()
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={aplicarCupomCarrinho}
                  >
                    APLICAR
                  </button>
                </div>
              ) : (
                <div className="coupon-applied">
                  <div>
                    <strong>{cupom}</strong>
                    <span>10% de desconto</span>
                  </div>

                  <button
                    type="button"
                    onClick={removerCupomCarrinho}
                  >
                    Remover
                  </button>
                </div>
              )}

              {mensagemCupom && (
                <p className="coupon-message">
                  {mensagemCupom}
                </p>
              )}
            </div>

            <div className="cart-summary">
              <div>
                <span>Produtos</span>
                <span>{quantidadeItens}</span>
              </div>

              <div>
                <span>Subtotal</span>
                <strong>
                  R$ {formatarPreco(subtotal)}
                </strong>
              </div>

              {cupomAplicado && (
                <div className="cart-discount">
                  <span>Desconto</span>
                  <strong>
                    - R$ {formatarPreco(descontoCupom)}
                  </strong>
                </div>
              )}

              <div className="cart-total">
                <span>Total</span>
                <strong>
                  R$ {formatarPreco(totalComDesconto)}
                </strong>
              </div>
            </div>

            <button
              className="cart-checkout"
              onClick={irParaCheckout}
            >
              FINALIZAR COMPRA
            </button>
          </>
        )}
      </aside>
    </>
  )
}

export default CartSidebar