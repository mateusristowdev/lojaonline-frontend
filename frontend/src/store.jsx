import { createContext, useContext, useEffect, useState } from "react"
import { apiFetch } from "./services/api"

const StoreContext = createContext(null)

export function StoreProvider({ children }) {

  const [page, setPage] = useState("home")

  const [produtoSelecionado, setProdutoSelecionado] =
    useState(null)

  const [usuario, setUsuario] = useState(() => {

    const usuarioSalvo =
      localStorage.getItem("usuario")

    return usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : null
  })

  const [carrinho, setCarrinho] = useState([])

  const [carrinhoAberto, setCarrinhoAberto] =
    useState(false)

  const [carregandoCarrinho, setCarregandoCarrinho] =
    useState(false)

  async function login(dadosUsuario) {

    try {

      if (
        !dadosUsuario?.email ||
        !dadosUsuario?.senha
      ) {
        throw new Error(
          "E-mail e senha são obrigatórios"
        )
      }

      const response = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: dadosUsuario.email,
            senha: dadosUsuario.senha
          })
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data.erro ||
          "Erro ao fazer login"
        )
      }
      if (!data.token) {
        throw new Error(
          "Token não recebido pelo servidor"
        )
      }
      localStorage.setItem(
        "token",
        data.token
      )
      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      )
      setUsuario(data.usuario)
      return data
    } catch (error) {
      console.error(
        "Erro no login:",
        error
      )
      throw error
    }
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    setUsuario(null)
    setCarrinho([])
    setCarrinhoAberto(false)
    setPage("home")
  }

  async function carregarCarrinho() {
    if (!usuario) {
      setCarrinho([])
      return
    }
    try {
      setCarregandoCarrinho(true)
      const data = await apiFetch(
        "/carrinho"
      )
      setCarrinho(
        data?.itens || []
      )
    } catch (error) {
      console.error(
        "Erro ao carregar carrinho:",
        error
      )
      setCarrinho([])
    } finally {
      setCarregandoCarrinho(false)
    }
  }

  useEffect(() => {

    if (usuario && !usuario.is_admin) {
      carregarCarrinho()
    } else {
      setCarrinho([])
    }

  }, [usuario])

  async function adicionarAoCarrinho(produto) {

    try {

      const item = await apiFetch(
        "/carrinho",
        {
          method: "POST",

          body: JSON.stringify({
            produtoId: produto.id,
            quantidade: 1
          })
        }
      )

      setCarrinho((carrinhoAtual) => {

        const itemExistente =
          carrinhoAtual.find(
            (itemCarrinho) =>
              itemCarrinho.produtos.id ===
              produto.id
          )

        if (itemExistente) {

          return carrinhoAtual.map(
            (itemCarrinho) =>
              itemCarrinho.id === item.id
                ? item
                : itemCarrinho
          )
        }

        return [
          ...carrinhoAtual,
          item
        ]
      })

      setCarrinhoAberto(true)

      return item

    } catch (error) {

      console.error(
        "Erro ao adicionar produto:",
        error
      )

      throw error
    }
  }

  async function alterarQuantidade(
    itemId,
    quantidade
  ) {

    try {

      const itemAtualizado =
        await apiFetch(
          `/carrinho/${itemId}`,
          {
            method: "PATCH",

            body: JSON.stringify({
              quantidade
            })
          }
        )

      setCarrinho(
        (carrinhoAtual) =>
          carrinhoAtual.map(
            (item) =>
              item.id === itemId
                ? itemAtualizado
                : item
          )
      )

    } catch (error) {

      console.error(
        "Erro ao alterar quantidade:",
        error
      )

      throw error
    }
  }

  async function removerDoCarrinho(itemId) {

    try {

      await apiFetch(
        `/carrinho/${itemId}`,
        {
          method: "DELETE"
        }
      )

      setCarrinho(
        (carrinhoAtual) =>
          carrinhoAtual.filter(
            (item) =>
              item.id !== itemId
          )
      )

    } catch (error) {

      console.error(
        "Erro ao remover produto:",
        error
      )

      throw error
    }
  }

  async function limparCarrinho() {

    try {

      await apiFetch(
        "/carrinho",
        {
          method: "DELETE"
        }
      )

      setCarrinho([])

    } catch (error) {

      console.error(
        "Erro ao limpar carrinho:",
        error
      )

      throw error
    }
  }

  function abrirCarrinho() {
    setCarrinhoAberto(true)
  }

  function fecharCarrinho() {
    setCarrinhoAberto(false)
  }

  const quantidadeItens =
    carrinho.reduce(
      (total, item) =>
        total + Number(item.quantidade),
      0
    )

  const totalCarrinho =
    carrinho.reduce(
      (total, item) =>
        total +
        Number(item.produtos.preco) *
        Number(item.quantidade),
      0
    )

  return (

    <StoreContext.Provider
      value={{
        page,
        setPage,

        usuario,

        login,
        logout,

        produtoSelecionado,
        setProdutoSelecionado,

        carrinho,

        adicionarAoCarrinho,
        alterarQuantidade,
        removerDoCarrinho,
        limparCarrinho,

        quantidadeItens,
        totalCarrinho,

        carregandoCarrinho,

        carrinhoAberto,
        abrirCarrinho,
        fecharCarrinho
      }}
    >

      {children}

    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}