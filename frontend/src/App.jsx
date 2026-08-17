import { useState } from "react"

import { StoreProvider, useStore } from "./store"

import Login from "./components/Login"
import Cadastro from "./components/Cadastro"
import HomePage from "./components/HomePage"
import AdminPanel from "./components/AdminPanel"

import "./components/Auth.css"

function AppContent() {
  const {
    usuario,
    page
  } = useStore()

  const [telaAuth, setTelaAuth] = useState("login")

  // Se não estiver logado,
  // mostra login ou cadastro
  if (!usuario) {
    if (telaAuth === "cadastro") {
      return (
        <Cadastro
          onLogin={() => setTelaAuth("login")}
        />
      )
    }

    return (
      <Login
        onCadastro={() => setTelaAuth("cadastro")}
      />
    )
  }

  // Usuário comum
  if (usuario.tipo === "usuario") {
    return <HomePage />
  }

  // Administrador
  if (
    usuario.tipo === "admin" &&
    page === "admin"
  ) {
    return <AdminPanel />
  }

  // Segurança:
  // se for admin mas tentar acessar outra página,
  // manda para home
  return <HomePage />
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}

export default App