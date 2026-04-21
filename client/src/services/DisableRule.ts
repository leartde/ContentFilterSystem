const DisableRule = async( ruleId: number) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/rules/${ruleId}/disable`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    throw new Error(`Failed to disable rule: ${response.status}`);
  }
  return true;
}

export default DisableRule;
