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
    usuario,
    setPage
  } = useStore()

  if (page === "login") {
    return (
      <LoginPage
        onCadastro={() => setPage("cadastro")}
      />
    )
  }

  if (page === "cadastro") {
    return (
      <Cadastro
        onLogin={() => setPage("login")}
      />
    )
  }

  if (usuario?.is_admin) {
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