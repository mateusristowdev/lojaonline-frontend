import { useEffect, useState } from "react"
import { useStore } from "../store"
import { apiFetch } from "../services/api"
import "./AdminPanel.css"

function AdminPanel() {

  const {
    usuario,
    logout
  } = useStore()

  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)

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
    imagem: null,
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
      checked,
      files
    } = event.target

    setFormulario({
      ...formulario,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files[0]
            : value
    })
  }

  function novoProduto() {

    setProdutoEditando(null)

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
      imagem: null,
      estoque: "",
      destaque: false,
      novo: false,
      categoriasId: ""
    })

    setMostrarFormulario(true)
  }

  function editarProduto(produto) {

    setProdutoEditando(produto)

    setFormulario({
      nome: produto.nome || "",
      clube: produto.clube || "",
      pais: produto.pais || "",
      liga: produto.liga || "",
      continente: produto.continente || "",
      temporada: produto.temporada || "",
      tipo: produto.tipo || "",
      marca: produto.marca || "",
      cor: produto.cor || "",
      descricao: produto.descricao || "",
      preco: produto.preco || "",
      precoOriginal: produto.precoOriginal || "",
      imagem: null,
      estoque: produto.estoque || "",
      destaque: produto.destaque || false,
      novo: produto.novo || false,
      categoriasId: produto.categoriasId || ""
    })

    setMostrarFormulario(true)
  }

  function fecharFormulario() {

    setMostrarFormulario(false)
    setProdutoEditando(null)

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
      imagem: null,
      estoque: "",
      destaque: false,
      novo: false,
      categoriasId: ""
    })
  }

  async function salvarProduto(event) {

    event.preventDefault()

    try {

      const formData = new FormData()

      formData.append("nome", formulario.nome)
      formData.append("clube", formulario.clube)
      formData.append("pais", formulario.pais)
      formData.append("liga", formulario.liga)
      formData.append("continente", formulario.continente)
      formData.append("temporada", formulario.temporada)
      formData.append("tipo", formulario.tipo)
      formData.append("marca", formulario.marca)
      formData.append("cor", formulario.cor)
      formData.append("descricao", formulario.descricao)
      formData.append("preco", formulario.preco)
      formData.append("precoOriginal", formulario.precoOriginal)
      formData.append("estoque", formulario.estoque)
      formData.append("destaque", formulario.destaque)
      formData.append("novo", formulario.novo)
      formData.append("categoriasId", formulario.categoriasId)

      if (formulario.imagem) {
        formData.append("imagem", formulario.imagem)
      }

      if (produtoEditando) {

        await apiFetch(
          `/produtos/${produtoEditando.id}`,
          {
            method: "PUT",
            body: formData
          }
        )

        alert("Produto atualizado com sucesso!")

      } else {

        await apiFetch(
          "/produtos",
          {
            method: "POST",
            body: formData
          }
        )

        alert("Produto cadastrado com sucesso!")
      }

      fecharFormulario()

      await carregarProdutos()

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        "Erro ao salvar produto"
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
            onClick={
              mostrarFormulario
                ? fecharFormulario
                : novoProduto
            }
          >
            {mostrarFormulario
              ? "Fechar"
              : "Novo Produto"}
          </button>

        </div>

        {mostrarFormulario && (

          <form
            className="admin-form"
            onSubmit={salvarProduto}
          >

            <h2>
              {produtoEditando
                ? "Editar Produto"
                : "Novo Produto"}
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
                type="file"
                accept="image/*"
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
              {produtoEditando
                ? "Salvar Alterações"
                : "Cadastrar Produto"}
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
                      src={`http://localhost:3000${produto.imagem}`}
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
                    onClick={() =>
                      editarProduto(produto)
                    }
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