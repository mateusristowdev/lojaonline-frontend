import { useState } from "react"
import { useStore } from "../store"
import "./CheckoutPage.css"

function CheckoutPage() {
  const {
    carrinho,
    totalCarrinho,
    quantidadeItens,
    setPage,
    limparCarrinho,
    cupom,
    cupomAplicado
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
  const [consultandoCep, setConsultandoCep] = useState(false)
  const [erroFrete, setErroFrete] = useState("")
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false)

  function formatarPreco(valor) {
    return Number(valor || 0)
      .toFixed(2)
      .replace(".", ",")
  }

  const descontoCupom = cupomAplicado
    ? totalCarrinho * 0.1
    : 0

  const totalComDesconto =
    totalCarrinho - descontoCupom

  function formatarCep(valor) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 8)

    if (numeros.length <= 5) {
      return numeros
    }

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`
  }

  function formatarTelefone(valor) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 11)

    if (numeros.length === 0) {
      return ""
    }

    if (numeros.length <= 2) {
      return `(${numeros}`
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
    }

    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  }

  async function buscarCep(valor) {
    const cepLimpo = valor
      .replace(/\D/g, "")

    if (cepLimpo.length !== 8) {
      return
    }

    try {
      setConsultandoCep(true)
      setErroFrete("")

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      )

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível consultar o CEP."
        )
      }

      const dados = await resposta.json()

      if (dados.erro) {
        setRua("")
        setBairro("")
        setCidade("")
        setEstado("")
        setErroFrete("CEP não encontrado.")
        return
      }

      setRua(dados.logradouro || "")
      setBairro(dados.bairro || "")
      setCidade(dados.localidade || "")
      setEstado(dados.uf || "")
      setErroFrete("")
    } catch (error) {
      console.error(
        "Erro ao consultar CEP:",
        error
      )

      setErroFrete(
        "Não foi possível consultar o CEP."
      )
    } finally {
      setConsultandoCep(false)
    }
  }

  async function calcularFrete() {
    const cepLimpo = cep.replace(/\D/g, "")

    if (cepLimpo.length !== 8) {
      setErroFrete("Digite um CEP válido.")
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      setErroFrete(
        "Entre na sua conta para calcular o frete."
      )
      return
    }

    if (!carrinho.length) {
      setErroFrete("Seu carrinho está vazio.")
      return
    }

    setCalculandoFrete(true)
    setErroFrete("")
    setFretes([])
    setFreteSelecionado(null)

    try {
      const produtos = carrinho.map(item => {
        const produto = item.produtos

        return {
          id: produto.id,
          nome: produto.nome,
          peso: Number(produto.peso || 1),
          altura: Number(produto.altura || 10),
          largura: Number(produto.largura || 20),
          comprimento: Number(
            produto.comprimento || 30
          ),
          valor: Number(produto.preco || 0),
          quantidade: Number(item.quantidade || 1)
        }
      })

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fretes/calcular`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
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
              frete =>
                !frete.error &&
                Number.isFinite(
                  Number(frete.price)
                )
            )
          : []

      if (!fretesDisponiveis.length) {
        throw new Error(
          "Nenhuma opção de frete disponível para este CEP."
        )
      }

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

  function alterarCep(valor) {
    const novoCep = formatarCep(valor)

    setCep(novoCep)

    setFretes([])
    setFreteSelecionado(null)
    setErroFrete("")

    const cepLimpo = novoCep.replace(
      /\D/g,
      ""
    )

    if (cepLimpo.length === 8) {
      buscarCep(novoCep)
    }
  }

  const valorFrete = freteSelecionado
    ? Number(freteSelecionado.price || 0)
    : 0

  const totalFinal =
    totalComDesconto + valorFrete

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
      console.error(error)

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
            Obrigado pela sua compra. Seu pedido
            foi recebido e será preparado para
            envio.
          </p>

          <button
            onClick={() => setPage("home")}
          >
            CONTINUAR COMPRANDO
          </button>

        </div>
      </main>
    )
  }

  if (!carrinho.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">

          <h1>
            Seu carrinho está vazio
          </h1>

          <p>
            Adicione alguns produtos antes de
            finalizar a compra.
          </p>

          <button
            onClick={() => setPage("camisas")}
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
            onClick={() => setPage("home")}
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
                    onChange={e =>
                      setNome(e.target.value)
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
                    onChange={e =>
                      setEmail(e.target.value)
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
                    maxLength={15}
                    onChange={e =>
                      setTelefone(
                        formatarTelefone(
                          e.target.value
                        )
                      )
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
                    maxLength={9}
                    onChange={e =>
                      alterarCep(
                        e.target.value
                      )
                    }
                  />

                  {consultandoCep && (
                    <small>
                      Buscando endereço...
                    </small>
                  )}

                </div>

                <div className="checkout-field">

                  <label>
                    Estado *
                  </label>

                  <input
                    type="text"
                    placeholder="PR"
                    value={estado}
                    maxLength={2}
                    onChange={e =>
                      setEstado(
                        e.target.value.toUpperCase()
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
                    onChange={e =>
                      setRua(e.target.value)
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
                    onChange={e =>
                      setNumero(e.target.value)
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
                    onChange={e =>
                      setComplemento(
                        e.target.value
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
                    onChange={e =>
                      setBairro(e.target.value)
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
                    onChange={e =>
                      setCidade(e.target.value)
                    }
                  />

                </div>

              </div>

              {erroFrete && (
                <div className="shipping-error">
                  {erroFrete}
                </div>
              )}

              <button
                type="button"
                onClick={calcularFrete}
                disabled={
                  calculandoFrete ||
                  consultandoCep
                }
              >
                {calculandoFrete
                  ? "CALCULANDO..."
                  : "CALCULAR FRETE"}
              </button>

              {calculandoFrete && (
                <div className="shipping-loading">
                  Calculando opções de frete...
                </div>
              )}

              {fretes.length > 0 && (
                <div className="shipping-options">

                  <h3>
                    Opções de entrega
                  </h3>

                  {fretes.map(frete => {

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
                            Prazo estimado:{" "}
                            {frete.delivery_range?.min ??
                              "—"}
                            –
                            {frete.delivery_range?.max ??
                              "—"}{" "}
                            dias
                          </small>

                        </div>

                        <strong className="shipping-price">
                          R${" "}
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
                    onChange={e =>
                      setPagamento(
                        e.target.value
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
                    onChange={e =>
                      setPagamento(
                        e.target.value
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
                    onChange={e =>
                      setPagamento(
                        e.target.value
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

                {carrinho.map(item => {

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
                          Quantidade:{" "}
                          {item.quantidade}
                        </span>

                        <strong>
                          R${" "}
                          {formatarPreco(
                            Number(
                              produto.preco || 0
                            ) *
                            Number(
                              item.quantidade || 0
                            )
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
                    Subtotal
                  </span>

                  <strong>
                    R${" "}
                    {formatarPreco(
                      totalCarrinho
                    )}
                  </strong>
                </div>

                {cupomAplicado && (
                  <div className="checkout-discount">

                    <span>
                      Cupom {cupom}
                    </span>

                    <strong>
                      - R${" "}
                      {formatarPreco(
                        descontoCupom
                      )}
                    </strong>

                  </div>
                )}

                {cupomAplicado && (
                  <div>

                    <span>
                      Total com desconto
                    </span>

                    <strong>
                      R${" "}
                      {formatarPreco(
                        totalComDesconto
                      )}
                    </strong>

                  </div>
                )}

                <div>

                  <span>
                    Frete
                  </span>

                  {freteSelecionado ? (
                    <strong>
                      R${" "}
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
                    R${" "}
                    {formatarPreco(
                      totalFinal
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