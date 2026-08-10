import { useState } from "react"

function Cadastro({ onLogin }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    function submit(event) {
        event.preventDefault()

        alert('Cadastro realizado!')
    }

    return (
        <div className="auth-card">
            <h1>Criar conta</h1>
        
            <p className="auth-subtitle">Cadastre-se para continuar</p>

            <form onSubmit={submit}>
                <label>Nome</label>

                <input 
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)} required
                />

                <label>E-mail</label>

                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)} required
                />

                <input 
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)} required
                />

                <button type="submit">Criar conta</button>
            </form>

            <p className="auth-change">Já possui uma conta?</p>

            <button className="#link-button" onClick={onLogin}>
                Voltar para login
            </button>
        </div>
    )
}

export default Cadastro