const DeleteRule = async (id: number) =>{
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/rules/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete rule: ${response.status}`);
  }
  return true;
}

export default DeleteRule;
