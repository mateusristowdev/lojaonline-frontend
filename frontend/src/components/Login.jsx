import { useState } from "react"
import { useStore } from "../store"
import "./Auth.css"

function Login({ onCadastro, onLogin }) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [modoAdmin, setModoAdmin] = useState(false)

  const { login } = useStore()

  function entrarComoAdmin() {
    setModoAdmin(true)
  }

  function voltarLogin() {
    setModoAdmin(false)
    setEmail("")
    setSenha("")
  }

  function submit(event) {
    event.preventDefault()
  
    if (modoAdmin) {
      login({
        email: email,
        tipo: "admin"
      })
  
      alert("Login de administrador realizado!")
  
      return
    }
  
    login({
      email: email,
      tipo: "usuario"
    })
  
    alert("Login realizado!")
  
    if (onLogin) {
      onLogin()
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card">

        <div className="auth-header">
          <div className="logo">
            <span className="logo-m">M</span>

            <span className="logo-text">
              MANTO <span>017</span>
            </span>
          </div>

          <button
            type="button"
            className="close-button"
          >
            ×
          </button>
        </div>

        <div className="auth-tabs">

          <button
            type="button"
            className={!modoAdmin ? "tab active" : "tab"}
            onClick={voltarLogin}
          >
            Entrar
          </button>

          <button
            type="button"
            className="tab"
            onClick={onCadastro}
          >
            Criar Conta
          </button>

          <button
            type="button"
            className={
              modoAdmin
                ? "tab active admin-tab"
                : "tab"
            }
            onClick={entrarComoAdmin}
          >
            Admin
          </button>

        </div>

        {modoAdmin && (
          <div className="admin-warning">
            <strong>Área restrita.</strong>
            <br />
            Use as credenciais de administrador.
          </div>
        )}

        <form onSubmit={submit}>

          <div className="form-group">
            <label>
              E-MAIL <span>*</span>
            </label>

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              SENHA <span>*</span>
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              required
            />
          </div>

          {!modoAdmin && (
            <div className="forgot-password">
              <button type="button">
                Esqueci minha senha
              </button>
            </div>
          )}

          <button
            type="submit"
            className={
              modoAdmin
                ? "submit-button admin-submit"
                : "submit-button"
            }
          >
            {modoAdmin
              ? "Entrar como Admin"
              : "Entrar na conta"}
          </button>

        </form>

        {modoAdmin ? (
          <div className="auth-footer">
            Acesso restrito a colaboradores autorizados.
          </div>
        ) : (
          <div className="auth-footer">
            Não tem conta?{" "}

            <button
              type="button"
              onClick={onCadastro}
            >
              Criar agora
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Login