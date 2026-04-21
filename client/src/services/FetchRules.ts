const FetchRules =  async() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/rules`);

  if (!response.ok) {
    throw new Error(`Failed to fetch rules: ${response.status}`);
  }

  return response.json();
};

export default FetchRules;
