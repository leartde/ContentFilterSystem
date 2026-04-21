const EnableRule = async( ruleId: number) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/rules/${ruleId}/enable`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    throw new Error(`Failed to enable rule: ${response.status}`);
  }
  return true;
}

export default EnableRule;
