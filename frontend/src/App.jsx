import { useState } from 'react'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import './components/Auth.css'

function App() {
  const [tela, setTela] = useState('login')

  return (
    <div className="auth-page">
      {tela === 'login' ? (
        <Login onCadastro={() => setTela('cadastro')} />
      ) : (
        <Cadastro onLogin={() => setTela('login')} />
      )}
    </div>
  )
}

export default App