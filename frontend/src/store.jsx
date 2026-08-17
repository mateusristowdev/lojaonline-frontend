import { createContext, useContext, useState } from "react"

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [page, setPage] = useState("home")

  const [usuario, setUsuario] = useState(null)

  const [carrinho, setCarrinho] = useState([])

  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  function login(dadosUsuario) {
    setUsuario(dadosUsuario)
  }

  function logout() {
    setUsuario(null)
    setPage("home")
  }

  function adicionarAoCarrinho(produto) {
    setCarrinho((carrinhoAtual) => [
      ...carrinhoAtual,
      produto
    ])
  }

  function removerDoCarrinho(id) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter(
        (produto) => produto.id !== id
      )
    )
  }

  function abrirCarrinho() {
    setCarrinhoAberto(true)
  }

  function fecharCarrinho() {
    setCarrinhoAberto(false)
  }

  return (
    <StoreContext.Provider
      value={{
        page,
        setPage,

        usuario,
        login,
        logout,

        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,

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