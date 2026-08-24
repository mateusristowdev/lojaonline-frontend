import { createContext, useContext, useState } from "react"

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [page, setPage] = useState("home")

  const [usuario, setUsuario] = useState(null)

  const [carrinho, setCarrinho] = useState([])

  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  async function login(dadosUsuario) {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: dadosUsuario.email,
          senha: dadosUsuario.senha,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.erro || "Erro ao fazer login");
      }
  
      console.log("Login realizado:", data);
  
      localStorage.setItem("token", data.token);
  
      setUsuario({
        email: dadosUsuario.email,
      });
  
      return data;
  
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
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