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

  const [fretes, setFretes] = useState([])
  const [freteSelecionado, setFreteSelecionado] = useState(null)
  const [calculandoFrete, setCalculandoFrete] = useState(false)
  const [erroFrete, setErroFrete] = useState("")

  const [pedidoFinalizado, setPedidoFinalizado] =
    useState(false)


  function formatarPreco(valor) {
    return Number(valor)
      .toFixed(2)
      .replace(".", ",")
  }


  function formatarCep(valor) {

    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 8)

    if (numeros.length <= 5) {
      return numeros
    }

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`
  }


  async function calcularFrete() {

    const cepLimpo = cep.replace(/\D/g, "")

    if (cepLimpo.length !== 8) {

      setErroFrete("Digite um CEP válido.")
      setFretes([])
      setFreteSelecionado(null)

      return
    }


    const token = localStorage.getItem("token")

    if (!token) {

      setErroFrete(
        "Entre na sua conta para calcular o frete."
      )

      return
    }


    if (!carrinho || carrinho.length === 0) {

      setErroFrete(
        "Seu carrinho está vazio."
      )

      return
    }


    setCalculandoFrete(true)
    setErroFrete("")
    setFretes([])
    setFreteSelecionado(null)


    try {

      const produtos = carrinho.map((item) => {

        const produto = item.produtos

        return {
          id: produto.id,
          nome: produto.nome,

          peso: Number(produto.peso),
          altura: Number(produto.altura),
          largura: Number(produto.largura),
          comprimento: Number(produto.comprimento),

          valor: Number(produto.preco),
          quantidade: Number(item.quantidade)
        }
      })


      console.log(
        "Produtos enviados para cálculo do frete:"
      )

      console.log(produtos)


      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fretes/calcular`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            cepDestino: cepLimpo,
            produtos
          })
        }
      )


      const data = await response.json()


      if (!response.ok) {

        throw new Error(
          data.erro ||
          "Não foi possível calcular o frete."
        )
      }


      const fretesDisponiveis =
        Array.isArray(data.fretes)
          ? data.fretes.filter(
              (frete) =>
                !frete.error &&
                Number.isFinite(
                  Number(frete.price)
                )
            )
          : []


      if (fretesDisponiveis.length === 0) {

        throw new Error(
          "Nenhuma opção de frete disponível para este CEP."
        )
      }


      console.log(
        "Fretes disponíveis:"
      )

      console.log(fretesDisponiveis)


      setFretes(fretesDisponiveis)
      setFreteSelecionado(
        fretesDisponiveis[0]
      )

    } catch (error) {

      console.error(
        "Erro ao calcular frete:",
        error
      )


      setErroFrete(
        error.message ||
        "Não foi possível calcular o frete."
      )

    } finally {

      setCalculandoFrete(false)

    }
  }


  const valorFrete =
    freteSelecionado
      ? Number(freteSelecionado.price)
      : 0


  const totalComFrete =
    Number(totalCarrinho) +
    valorFrete


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


    if (!freteSelecionado) {

      alert(
        "Calcule e selecione uma opção de frete."
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

          <div className="success-message">
            OK
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
            CONTINUAR COMPRANDO
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


                  <div
                    style={{
                      display: "flex",
                      gap: "10px"
                    }}
                  >

                    <input
                      type="text"
                      placeholder="00000-000"
                      value={cep}
                      maxLength={9}
                      onChange={(event) => {

                        const novoCep =
                          formatarCep(
                            event.target.value
                          )

                        setCep(novoCep)

                        setFretes([])
                        setFreteSelecionado(null)
                        setErroFrete("")
                      }}
                    />


                    <button
                      type="button"
                      onClick={calcularFrete}
                      disabled={calculandoFrete}
                      style={{
                        whiteSpace: "nowrap",
                        cursor:
                          calculandoFrete
                            ? "wait"
                            : "pointer"
                      }}
                    >

                      {calculandoFrete
                        ? "CALCULANDO..."
                        : "CALCULAR FRETE"}

                    </button>

                  </div>

                </div>

                <div className="checkout-field">

                  <label>
                    Estado *
                  </label>

                  <input
                    type="text"
                    placeholder="SP"
                    value={estado}
                    maxLength={2}
                    onChange={(event) =>
                      setEstado(
                        event.target.value
                          .toUpperCase()
                      )
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
                      setNumero(
                        event.target.value
                      )
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
                      setBairro(
                        event.target.value
                      )
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
                      setCidade(
                        event.target.value
                      )
                    }
                  />

                </div>


              </div>

              {calculandoFrete && (

                <div className="shipping-loading">

                  Calculando opções de frete...

                </div>

              )}

              {erroFrete && (

                <div className="shipping-error">

                  {erroFrete}

                </div>

              )}

              {fretes.length > 0 && (

                <div className="shipping-options">

                  <h3>
                    Opções de entrega
                  </h3>


                  {fretes.map((frete) => {

                    const selecionado =
                      freteSelecionado?.id ===
                      frete.id


                    return (

                      <label
                        key={frete.id}
                        className={
                          selecionado
                            ? "shipping-option active"
                            : "shipping-option"
                        }
                      >


                        <input
                          type="radio"
                          name="frete"
                          checked={selecionado}
                          onChange={() =>
                            setFreteSelecionado(
                              frete
                            )
                          }
                        />


                        <div className="shipping-info">

                          <strong>
                            {frete.name}
                          </strong>


                          <span>
                            {frete.company?.name ||
                              "Transportadora"}
                          </span>


                          <small>

                            Prazo estimado:
                            {" "}

                            {frete.delivery_range?.min ??
                              "—"}

                            {"–"}

                            {frete.delivery_range?.max ??
                              "—"}

                            {" "}
                            dias

                          </small>

                        </div>


                        <strong className="shipping-price">

                          R$
                          {" "}

                          {formatarPreco(
                            frete.price
                          )}

                        </strong>


                      </label>

                    )

                  })}

                </div>

              )}

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
                    checked={
                      pagamento === "pix"
                    }
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
                            src={`${import.meta.env.VITE_API_URL}/uploads/${produto.imagem}`}
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


                  {freteSelecionado ? (

                    <strong>

                      R$
                      {" "}

                      {formatarPreco(
                        valorFrete
                      )}

                    </strong>

                  ) : (

                    <strong className="free-shipping">

                      Calcule o frete

                    </strong>

                  )}

                </div>

                <div className="checkout-total">

                  <span>
                    Total
                  </span>


                  <strong>

                    R$
                    {" "}

                    {formatarPreco(
                      totalComFrete
                    )}

                  </strong>

                </div>


              </div>

              <button
                className="checkout-finish"
                onClick={finalizarPedido}
                disabled={!freteSelecionado}
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