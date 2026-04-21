const ProcessText = async(text: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/text/${text}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to process text: ${response.status}`);
  }

  return response.json();
}

export default ProcessText;


