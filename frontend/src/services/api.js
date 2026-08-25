const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, options = {}) {

  const token = localStorage.getItem("token")

  const resposta = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}),

        ...(options.headers || {})
      }
    }
  )


  const contentType =
    resposta.headers.get("content-type")


  const dados =
    contentType &&
    contentType.includes("application/json")
      ? await resposta.json()
      : null


  if (!resposta.ok) {

    throw new Error(
      dados?.erro ||
      dados?.detail ||
      "Erro na requisição"
    )

  }


  return dados
}