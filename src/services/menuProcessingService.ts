interface MenuProcessingResponse {
  success: boolean
  documentId: string
  menuCount: number
}

export const processMenuImage = async (storageId: string): Promise<MenuProcessingResponse> => {
  const apiEndpoint = import.meta.env.VITE_MENU_PROCESSING_API_URL || ""

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      storageId,
    }),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const result = await response.json()
  return result
}
