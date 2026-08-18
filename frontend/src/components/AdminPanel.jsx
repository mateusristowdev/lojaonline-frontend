import { useStore } from "../store"

function AdminPanel() {
  const { usuario, logout } = useStore()

  return (
    <main className="admin-panel">

      <h1>
        Painel Administrativo
      </h1>

      <p>
        Bem-vindo, administrador.
      </p>

      <p>
        {usuario?.email}
      </p>

      <button onClick={logout}>
        Sair
      </button>

    </main>
  )
}

export default AdminPanel