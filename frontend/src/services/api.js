const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, options = {}) {
  const resposta = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  )

  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(
      dados.detail || "Erro na requisição"
    )
  }

  return dados
}