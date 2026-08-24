import { useState } from "react";
import "./Auth.css";

function Cadastro({ onLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function formatarCPF(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return valor;
  }

  function formatarTelefone(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 11);

    if (valor.length <= 10) {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return valor;
  }

  async function submit(event) {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais!");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    if (cpf.replace(/\D/g, "").length !== 11) {
      alert("Digite um CPF válido!");
      return;
    }

    const data = {
      nome,
      email,
      cpf,
      telefone: telefone || null,
      senha
    };

    console.log("Dados enviados para cadastro:", data);

    try {
      const response = await fetch(
        "http://localhost:3000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      const resultado = await response.json();

      console.log("Resposta do cadastro:", resultado);

      if (!response.ok) {
        throw new Error(
          resultado.erro || "Erro ao realizar cadastro"
        );
      }

      alert("Cadastro realizado com sucesso!");

      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");

      if (onLogin) {
        onLogin();
      }

    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.message || "Erro ao realizar cadastro");
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card cadastro-card">

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
            className="tab"
            onClick={onLogin}
          >
            Entrar
          </button>

          <button
            type="button"
            className="tab active"
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={submit}>

          <div className="form-group">
            <label>
              NOME COMPLETO <span>*</span>
            </label>

            <input
              type="text"
              placeholder="João Silva"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
              required
            />
          </div>

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

          <div className="form-row">

            <div className="form-group">
              <label>
                CPF <span>*</span>
              </label>

              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(event) =>
                  setCpf(
                    formatarCPF(event.target.value)
                  )
                }
                maxLength={14}
                required
              />
            </div>

            <div className="form-group">
              <label>
                TELEFONE
              </label>

              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(event) =>
                  setTelefone(
                    formatarTelefone(event.target.value)
                  )
                }
                maxLength={15}
              />
            </div>

          </div>

          <div className="form-group">
            <label>
              SENHA <span>*</span>
            </label>

            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label>
              CONFIRMAR SENHA <span>*</span>
            </label>

            <input
              type="password"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            Criar minha conta
          </button>

        </form>

        <div className="terms">
          Ao criar uma conta, você concorda com nossos{" "}
          <span>Termos de Uso.</span>
        </div>

      </div>
    </div>
  );
}

export default Cadastro;