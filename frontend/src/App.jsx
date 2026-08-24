import { useState } from "react"
import { StoreProvider, useStore } from "./store"

import LoginPage from "./components/Login"
import Cadastro from "./components/Cadastro"
import HomePage from "./components/HomePage"
import ProductsPage from "./components/ProductsPage"
import ProductDetail from "./components/ProductDetail"
import AdminPanel from "./components/AdminPanel"
import Header from "./components/Header"
import Footer from "./components/Footer"
import CartSidebar from "./components/CartSidebar"

import "./App.css"

function AppContent() {
  const {
    page,
    usuario
  } = useStore()

  const [telaAuth, setTelaAuth] = useState("login")

  if (!usuario) {
    return telaAuth === "login" ? (
      <LoginPage
        onCadastro={() => setTelaAuth("cadastro")}
      />
    ) : (
      <Cadastro
        onLogin={() => setTelaAuth("login")}
      />
    )
  }

  if (usuario.tipo === "admin") {
    return (
      <div className="app">
        <AdminPanel />
      </div>
    )
  }

  return (
    <div className="app">

      <Header />

      {page === "home" && <HomePage />}

      {page === "produtos" && <ProductsPage />}

      {page === "produto" && <ProductDetail />}

      {page === "visualizarprodutos" && <VisualizarProdutos/>}

      <Footer />

      <CartSidebar />

    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}