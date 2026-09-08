import { useState } from "react"
import { useStore } from "../store"
import "./CheckoutPage.css"

function CheckoutPage() {

  const {
    carrinho,
    totalCarrinho,
    quantidadeItens,
    setPage,
    limparCarrinho
  } = useStore()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")

  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")

  const [pagamento, setPagamento] = useState("pix")

  const [pedidoFinalizado, setPedidoFinalizado] =
    useState(false)

  function formatarPreco(valor) {
    return Number(valor)
      .toFixed(2)
      .replace(".", ",")
  }

  async function finalizarPedido() {

    if (
      !nome ||
      !email ||
      !telefone ||
      !cep ||
      !rua ||
      !numero ||
      !bairro ||
      !cidade ||
      !estado
    ) {
      alert(
        "Preencha todos os campos obrigatórios."
      )

      return
    }

    if (!pagamento) {
      alert(
        "Selecione uma forma de pagamento."
      )

      return
    }

    try {

      await limparCarrinho()

      setPedidoFinalizado(true)

    } catch (error) {

      console.error(
        "Erro ao finalizar pedido:",
        error
      )

      alert(
        "Não foi possível finalizar o pedido."
      )
    }
  }

  if (pedidoFinalizado) {
    return (

      <main className="checkout-page">

        <div className="checkout-success">

          <div className="success-icon">
            ✓
          </div>

          <span>
            PEDIDO REALIZADO
          </span>

          <h1>
            Compra finalizada com sucesso!
          </h1>

          <p>
            Obrigado pela sua compra.
            Seu pedido foi recebido e será
            preparado para envio.
          </p>

          <button
            onClick={() => {
              setPage("home")
            }}
          >
            CONTINUAR COMPRANDO
          </button>

        </div>

      </main>
    )
  }

  if (carrinho.length === 0) {
    return (

      <main className="checkout-page">

        <div className="checkout-empty">

          <h1>
            Seu carrinho está vazio
          </h1>

          <p>
            Adicione alguns produtos antes
            de finalizar a compra.
          </p>

          <button
            onClick={() => {
              setPage("produtos")
            }}
          >
            VER PRODUTOS
          </button>

        </div>

      </main>
    )
  }

  return (

    <main className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-title">

          <div>

            <span>
              FINALIZAR COMPRA
            </span>

            <h1>
              Checkout
            </h1>

          </div>

          <button
            className="checkout-back"
            onClick={() => {
              setPage("home")
            }}
          >
            ← CONTINUAR COMPRANDO
          </button>

        </div>


        <div className="checkout-content">


          <div className="checkout-form">


            <section className="checkout-section">

              <h2>
                1. Dados pessoais
              </h2>

              <div className="checkout-grid">

                <div className="checkout-field full">

                  <label>
                    Nome completo *
                  </label>

                  <input
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(event) =>
                      setNome(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    E-mail *
                  </label>

                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Telefone *
                  </label>

                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(event) =>
                      setTelefone(event.target.value)
                    }
                  />

                </div>

              </div>

            </section>



            <section className="checkout-section">

              <h2>
                2. Endereço de entrega
              </h2>

              <div className="checkout-grid">


                <div className="checkout-field">

                  <label>
                    CEP *
                  </label>

                  <input
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(event) =>
                      setCep(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Estado *
                  </label>

                  <input
                    type="text"
                    placeholder="PR"
                    value={estado}
                    onChange={(event) =>
                      setEstado(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field full">

                  <label>
                    Rua *
                  </label>

                  <input
                    type="text"
                    placeholder="Nome da rua"
                    value={rua}
                    onChange={(event) =>
                      setRua(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Número *
                  </label>

                  <input
                    type="text"
                    placeholder="123"
                    value={numero}
                    onChange={(event) =>
                      setNumero(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Complemento
                  </label>

                  <input
                    type="text"
                    placeholder="Apartamento, bloco..."
                    value={complemento}
                    onChange={(event) =>
                      setComplemento(
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Bairro *
                  </label>

                  <input
                    type="text"
                    placeholder="Seu bairro"
                    value={bairro}
                    onChange={(event) =>
                      setBairro(event.target.value)
                    }
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Cidade *
                  </label>

                  <input
                    type="text"
                    placeholder="Sua cidade"
                    value={cidade}
                    onChange={(event) =>
                      setCidade(event.target.value)
                    }
                  />

                </div>

              </div>

            </section>



            <section className="checkout-section">

              <h2>
                3. Forma de pagamento
              </h2>


              <div className="payment-options">


                <label
                  className={
                    pagamento === "pix"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="pagamento"
                    value="pix"
                    checked={pagamento === "pix"}
                    onChange={(event) =>
                      setPagamento(
                        event.target.value
                      )
                    }
                  />

                  <div>

                    <strong>
                      PIX
                    </strong>

                    <span>
                      Pagamento instantâneo
                    </span>

                  </div>

                </label>



                <label
                  className={
                    pagamento === "cartao"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="pagamento"
                    value="cartao"
                    checked={
                      pagamento === "cartao"
                    }
                    onChange={(event) =>
                      setPagamento(
                        event.target.value
                      )
                    }
                  />

                  <div>

                    <strong>
                      Cartão de crédito
                    </strong>

                    <span>
                      Pague sua compra com cartão
                    </span>

                  </div>

                </label>



                <label
                  className={
                    pagamento === "boleto"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="pagamento"
                    value="boleto"
                    checked={
                      pagamento === "boleto"
                    }
                    onChange={(event) =>
                      setPagamento(
                        event.target.value
                      )
                    }
                  />

                  <div>

                    <strong>
                      Boleto bancário
                    </strong>

                    <span>
                      Pagamento via boleto
                    </span>

                  </div>

                </label>

              </div>

            </section>

          </div>



          <aside className="checkout-summary">

            <div className="summary-card">

              <span className="summary-label">
                RESUMO DO PEDIDO
              </span>

              <h2>
                Seu pedido
              </h2>


              <div className="checkout-products">

                {carrinho.map((item) => {

                  const produto =
                    item.produtos

                  return (

                    <div
                      className="checkout-product"
                      key={item.id}
                    >

                      <div className="checkout-product-image">

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


                      <div className="checkout-product-info">

                        <h3>
                          {produto.nome}
                        </h3>

                        <span>
                          Quantidade:
                          {" "}
                          {item.quantidade}
                        </span>

                        <strong>
                          R$
                          {" "}
                          {formatarPreco(
                            Number(produto.preco) *
                            Number(item.quantidade)
                          )}
                        </strong>

                      </div>

                    </div>

                  )
                })}

              </div>


              <div className="checkout-summary-values">

                <div>

                  <span>
                    Produtos
                  </span>

                  <span>
                    {quantidadeItens}
                  </span>

                </div>


                <div>

                  <span>
                    Frete
                  </span>

                  <strong className="free-shipping">
                    Grátis
                  </strong>

                </div>


                <div className="checkout-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    R$
                    {" "}
                    {formatarPreco(
                      totalCarrinho
                    )}
                  </strong>

                </div>

              </div>


              <button
                className="checkout-finish"
                onClick={finalizarPedido}
              >
                CONFIRMAR PEDIDO
              </button>


              <p className="checkout-security">

                 Compra segura e protegida

              </p>

            </div>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default CheckoutPage