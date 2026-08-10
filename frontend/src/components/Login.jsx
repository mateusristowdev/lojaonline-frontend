import { useState } from "react"

function Login({ onCadastro }) {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    function submit(event) {
        event.preventDefault()

        alert("Login realizado!")
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={submit}>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                />

                <button type="submit">Entrar</button>
            </form>

            <button onClick={onCadastro}>Criar conta</button>
        </div>
    )
}

export default Login