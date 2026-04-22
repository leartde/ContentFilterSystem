import { type ChangeEvent, useState } from "react";
import type { AddRuleForm } from "../types/AddRule.ts";
import { COLOR_STYLES } from "../utils/colors.ts";
import CreateRule from "../services/CreateRule.ts";
import type { ViewRule } from "../types/ViewRule.ts";

type ColorName = keyof typeof COLOR_STYLES;
const COLOR_MAP: Record<1 | 2 | 3 | 4 | 5, ColorName> = {
  1: "Blue",
  2: "Green",
  3: "Yellow",
  4: "Orange",
  5: "Red",
};

const AddRule = ({setRules}: {setRules: React.Dispatch<React.SetStateAction<ViewRule[]>>}) => {
  const [form, setForm] = useState<AddRuleForm>({
    keyword: "",
    matchType: 1,
    actionType: 1,
    highlightColor: 1,
    tagText: null,
  });
  const [isColorOpen, setIsColorOpen] = useState(false);
  const colorName = COLOR_MAP[form.highlightColor as 1|2|3|4|5];


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "actionType") {
      const parsed = Number(value) as 1 | 2;
      setForm(prev => parsed === 1
        ? { ...prev, actionType: 1, highlightColor: 1, tagText: null }
        : { ...prev, actionType: 2, highlightColor: null, tagText: "" }
      );
      return;
    }

    const numericFields = ["matchType", "actionType"] as const;
    const parsedValue = numericFields.includes(id as (typeof numericFields)[number])
      ? Number(value)
      : value;

    setForm(prev => ({ ...prev, [id]: parsedValue } as AddRuleForm));
  };

  const handleSubmit = async(e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const createdRule = await CreateRule(form);
      setRules(prev => [...prev, createdRule]);
    } catch {
      console.error("Failed to create rule");
    }
  }


  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="keyword">Keyword</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            type="text"
            id="keyword"
            minLength={1}
            maxLength={50}
            value={form.keyword}
            onKeyDown={e => e.key === ' ' && e.preventDefault()}
            onPaste={e => {
              e.preventDefault();
              const pasted = e.clipboardData.getData('text').replace(/\s+/g, '');
              setForm(prev => ({ ...prev, keyword: pasted }));
            }}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="matchType">Match Type</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            id="matchType"
            value={form.matchType}
            onChange={handleInputChange}
          >
            <option value="1">Contains</option>
            <option value="2">Starts With</option>
            <option value="3">Exact</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="actionType">Action</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            id="actionType"
            value={form.actionType}
            onChange={handleInputChange}
          >
            <option value="1">Highlight</option>
            <option value="2">Tag</option>
          </select>
        </div>

        {form.actionType === 1 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Color</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColorOpen(!isColorOpen)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded" style={{ backgroundColor: COLOR_STYLES[colorName] }} />
                <span>{COLOR_MAP[form.highlightColor as keyof typeof COLOR_MAP]}</span>
              </button>

              {isColorOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {Object.entries(COLOR_MAP).map(([num, name]) => (
                    <div
                      key={num}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          actionType: 1,
                          highlightColor: Number(num) as 1|2|3|4|5,
                          tagText: null,
                        }));
                        setIsColorOpen(false);
                      }}
                    >
                      <div className="w-5 h-5 rounded" style={{ backgroundColor: COLOR_STYLES[name] }} />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {form.actionType === 2 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="tagText">Tag Text</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              type="text"
              id="tagText"
              value={form.tagText || ""}
              maxLength={50}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <button
        className="mt-5 cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        type="submit"
      >
        Save Rule
      </button>
    </form>
  );
};

export default AddRule;
