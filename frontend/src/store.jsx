import { createContext, useContext, useState } from "react"

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [page, setPage] = useState("home")

  const [usuario, setUsuario] = useState(null)

  const [carrinho, setCarrinho] = useState([])

  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

async function login(dadosUsuario) {
    console.log(dadosUsuario)
    let data = { email: dadosUsuario.email, senha: dadosUsuario.senha }
    await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(data => console.log(data))
    .catch((error) => {throw new Error('Error:', error)});
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