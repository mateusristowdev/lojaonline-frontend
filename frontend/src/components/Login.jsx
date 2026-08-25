import { useState } from "react";
import { useStore } from "../store";
import "./Auth.css";

function LoginPage({ onCadastro, onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { login } = useStore();

  const loginHandle = async () => {
    try {
      const data = await login({
        email,
        senha
      });

      console.log("Login realizado:", data);

      if (onLogin) {
        onLogin(data);
      }

    } catch (error) {
      console.error("Erro no login:", error);

      alert(
        error.message || "Erro ao fazer login"
      );
    }
  };

  async function submit(event) {
    event.preventDefault();

    await loginHandle();
  }

  return (
    <div className="auth-overlay">

      <div className="auth-card">

        <div className="auth-header">

          <div className="logo">

            <span className="logo-m">
              M
            </span>

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
            className="tab active"
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

        </div>


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


          <div className="forgot-password">

            <button type="button">
              Esqueci minha senha
            </button>

          </div>


          <button
            type="submit"
            className="submit-button"
          >
            Entrar na conta
          </button>

        </form>


        <div className="auth-footer">

          Não tem conta?{" "}

          <button
            type="button"
            onClick={onCadastro}
          >
            Criar agora
          </button>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;