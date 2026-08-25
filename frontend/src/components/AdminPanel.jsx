import { useEffect, useState } from "react"
import { useStore } from "../store"
import { apiFetch } from "../services/api"
import "./AdminPanel.css"

function AdminPanel() {

  const {
    setPage,
    usuario,
    logout
  } = useStore()

  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [formulario, setFormulario] = useState({
    nome: "",
    clube: "",
    pais: "",
    liga: "",
    continente: "",
    temporada: "",
    tipo: "",
    marca: "",
    cor: "",
    descricao: "",
    preco: "",
    precoOriginal: "",
    imagem: "",
    estoque: "",
    destaque: false,
    novo: false,
    categoriasId: ""
  })

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      setCarregando(true)
      setErro("")

      const dados = await apiFetch("/produtos")

      setProdutos(dados)

    } catch (error) {
      console.error(error)

      setErro(
        error.message ||
        "Erro ao carregar produtos"
      )

    } finally {
      setCarregando(false)
    }
  }

  function alterarCampo(event) {
    const {
      name,
      value,
      type,
      checked
    } = event.target

    setFormulario({
      ...formulario,
      [name]:
        type === "checkbox"
          ? checked
          : value
    })
  }

  async function cadastrarProduto(event) {
    event.preventDefault()

    try {
      await apiFetch("/produtos", {
        method: "POST",

        body: JSON.stringify({
          ...formulario,

          preco: Number(formulario.preco),

          precoOriginal:
            Number(formulario.precoOriginal),

          estoque:
            Number(formulario.estoque),

          categoriasId:
            Number(formulario.categoriasId)
        })
      })

      alert("Produto cadastrado com sucesso!")

      setFormulario({
        nome: "",
        clube: "",
        pais: "",
        liga: "",
        continente: "",
        temporada: "",
        tipo: "",
        marca: "",
        cor: "",
        descricao: "",
        preco: "",
        precoOriginal: "",
        imagem: "",
        estoque: "",
        destaque: false,
        novo: false,
        categoriasId: ""
      })

      setMostrarFormulario(false)

      carregarProdutos()

    } catch (error) {
      console.error(error)

      alert(
        error.message ||
        "Erro ao cadastrar produto"
      )
    }
  }

  async function excluirProduto(id) {

    const confirmar =
      window.confirm(
        "Tem certeza que deseja excluir este produto?"
      )

    if (!confirmar) {
      return
    }

    try {

      await apiFetch(`/produtos/${id}`, {
        method: "DELETE"
      })

      alert("Produto excluído com sucesso!")

      carregarProdutos()

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        "Erro ao excluir produto"
      )
    }
  }

  return (
    <main className="admin-page">

      <div className="admin-container">

        <div className="admin-header">

          <div>

            <p className="admin-label">
              ADMINISTRAÇÃO
            </p>

            <h1>
              Painel Administrativo
            </h1>

            <p className="admin-welcome">
              Gerencie os produtos da sua loja.
            </p>

          </div>

          <div className="admin-header-buttons">

            <button
              className="admin-logout-button"
              onClick={logout}
            >
              Sair
            </button>

          </div>

        </div>

        <div className="admin-actions">

          <div>

            <h2>
              Produtos
            </h2>

            <p>
              {produtos.length} produtos cadastrados
            </p>

          </div>

          <button
            className="admin-new-button"
            onClick={() =>
              setMostrarFormulario(
                !mostrarFormulario
              )
            }
          >
            {mostrarFormulario
              ? "Fechar"
              : "+ Novo Produto"}
          </button>

        </div>

        {mostrarFormulario && (

          <form
            className="admin-form"
            onSubmit={cadastrarProduto}
          >

            <h2>
              Novo Produto
            </h2>

            <div className="admin-form-grid">

              <input
                name="nome"
                placeholder="Nome do produto"
                value={formulario.nome}
                onChange={alterarCampo}
                required
              />

              <input
                name="clube"
                placeholder="Clube"
                value={formulario.clube}
                onChange={alterarCampo}
                required
              />

              <input
                name="pais"
                placeholder="País"
                value={formulario.pais}
                onChange={alterarCampo}
                required
              />

              <input
                name="liga"
                placeholder="Liga"
                value={formulario.liga}
                onChange={alterarCampo}
                required
              />

              <input
                name="continente"
                placeholder="Continente"
                value={formulario.continente}
                onChange={alterarCampo}
                required
              />

              <input
                name="temporada"
                placeholder="Temporada"
                value={formulario.temporada}
                onChange={alterarCampo}
                required
              />

              <input
                name="tipo"
                placeholder="Tipo"
                value={formulario.tipo}
                onChange={alterarCampo}
                required
              />

              <input
                name="marca"
                placeholder="Marca"
                value={formulario.marca}
                onChange={alterarCampo}
                required
              />

              <input
                name="cor"
                placeholder="Cor"
                value={formulario.cor}
                onChange={alterarCampo}
                required
              />

              <input
                name="preco"
                type="number"
                step="0.01"
                placeholder="Preço"
                value={formulario.preco}
                onChange={alterarCampo}
                required
              />

              <input
                name="precoOriginal"
                type="number"
                step="0.01"
                placeholder="Preço original"
                value={formulario.precoOriginal}
                onChange={alterarCampo}
                required
              />

              <input
                name="estoque"
                type="number"
                placeholder="Estoque"
                value={formulario.estoque}
                onChange={alterarCampo}
                required
              />

              <input
                name="categoriasId"
                type="number"
                placeholder="ID da categoria"
                value={formulario.categoriasId}
                onChange={alterarCampo}
                required
              />

              <input
                className="admin-input-full"
                name="imagem"
                placeholder="URL da imagem"
                value={formulario.imagem}
                onChange={alterarCampo}
              />

              <textarea
                className="admin-input-full"
                name="descricao"
                placeholder="Descrição do produto"
                value={formulario.descricao}
                onChange={alterarCampo}
                required
              />

            </div>

            <div className="admin-checkboxes">

              <label>

                <input
                  type="checkbox"
                  name="destaque"
                  checked={formulario.destaque}
                  onChange={alterarCampo}
                />

                Produto em destaque

              </label>

              <label>

                <input
                  type="checkbox"
                  name="novo"
                  checked={formulario.novo}
                  onChange={alterarCampo}
                />

                Produto novo

              </label>

            </div>

            <button
              type="submit"
              className="admin-save-button"
            >
              Cadastrar Produto
            </button>

          </form>

        )}

        <section className="admin-products">

          {carregando && (
            <p>
              Carregando produtos...
            </p>
          )}

          {erro && (
            <p className="admin-error">
              {erro}
            </p>
          )}

          {!carregando &&
            !erro &&
            produtos.map((produto) => (

              <div
                className="admin-product"
                key={produto.id}
              >

                <div className="admin-product-image">

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

                <div className="admin-product-info">

                  <span>
                    #{produto.id}
                  </span>

                  <h3>
                    {produto.nome}
                  </h3>

                  <p>
                    {produto.clube}
                  </p>

                </div>

                <div className="admin-product-price">

                  R$ {Number(produto.preco)
                    .toFixed(2)
                    .replace(".", ",")}

                </div>

                <div className="admin-product-stock">

                  Estoque:

                  <strong>
                    {produto.estoque}
                  </strong>

                </div>

                <div className="admin-product-actions">

                  <button
                    className="admin-edit-button"
                  >
                    Editar
                  </button>

                  <button
                    className="admin-delete-button"
                    onClick={() =>
                      excluirProduto(produto.id)
                    }
                  >
                    Excluir
                  </button>

                </div>

              </div>

            ))}

        </section>

      </div>

    </main>
  )
}

export default AdminPanel