import type { AddRuleForm } from "../types/AddRule.ts";

const CreateRule = async (rule: AddRuleForm) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const formData = new FormData();
  Object.entries(rule).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(`${baseUrl}/rules`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create rule: ${response.status}`);
  }

  return response.json();
};

export default CreateRule;
