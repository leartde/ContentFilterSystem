import type { ViewRule } from "../types/ViewRule.ts";
import { COLOR_STYLES } from "../utils/colors.ts";

type RuleColor = keyof typeof COLOR_STYLES;

const ColorLabel = ({ color }: { color: RuleColor | null}) => {
  if (!color) {
    return;
  }
  return (
    <span
      className="inline-block h-6 w-10 rounded border border-black/10"
      style={{ backgroundColor: COLOR_STYLES[color] }}
      title={color}
    />
  );
};

const TagLabel = ({ text }: { text: string | null }) => {
  if (!text){
    return;
  }
  return (<span className="flex justify-center items-center rounded font-bold bg-yellow-200/80 px-2 py-1 text-xs text-gray-700">
    {text}
  </span>);
}

const ViewRules = ({rules} : {rules: ViewRule[]}) => {

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-4 py-3">Keyword</th>
            <th className="px-4 py-3">Match Type</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Color / Tag</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rules.map((rule) => (
            <tr key={rule.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-bold">{rule.keyword}</td>
              <td className="px-4 py-3">{rule.matchType}</td>
              <td className="px-4 py-3">{rule.actionType}</td>
              <td className="px-4 py-3">
                {rule.actionType === "Highlight" ? (
                  <ColorLabel color={rule.highlightColor} />
                ) : (
                  <TagLabel text={rule.tagText} />
                )}
              </td>
              <td className="px-4 py-3">
                {rule.isEnabled ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                    Disabled
                  </span>
                )}
              </td>
              <td className="px-4 py-3 space-x-1">
                <a className="text-blue-400 font-semibold" href="">Edit</a>
                <a className="text-red-500 font-semibold" href="">Delete</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRules;
