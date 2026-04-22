import { Fragment, useMemo, useState } from "react";
import type { ViewRule } from "../types/ViewRule.ts";
import { COLOR_STYLES } from "../utils/colors.ts";


type RuleColor = keyof typeof COLOR_STYLES;
type GroupBy = "none" | "actionType" | "matchType";
type OrderBy = "default" | "actionType" | "matchType";

const ACTION_ORDER: Record<ViewRule["actionType"], number> = {
  Highlight: 0,
  Tag: 1,
};

const MATCH_TYPE_ORDER: Record<ViewRule["matchType"], number> = {
  Contains: 0,
  StartsWith: 1,
  Exact: 2,
};

const ColorLabel = ({ color }: { color: RuleColor}) => {
  return (
    <span
      className="inline-block h-6 w-10 rounded border border-black/10"
      style={{ backgroundColor: COLOR_STYLES[color] }}
      title={color}
    />
  );
};

const TagLabel = ({ text }: { text: string}) => {
  return (<span className="inline-flex max-w-52 justify-center rounded font-bold bg-yellow-200/80 px-2 py-1 text-center text-xs text-gray-700 wrap-break-word">
    {text}
  </span>);
}


const sortByField = (ruleA: ViewRule, ruleB: ViewRule, field: OrderBy) => {
  if (field === "actionType") {
    const orderDiff = ACTION_ORDER[ruleA.actionType] - ACTION_ORDER[ruleB.actionType];
    if (orderDiff !== 0) {
      return orderDiff;
    }
  }

  if (field === "matchType") {
    const orderDiff = MATCH_TYPE_ORDER[ruleA.matchType] - MATCH_TYPE_ORDER[ruleB.matchType];
    if (orderDiff !== 0) {
      return orderDiff;
    }
  }

  return ruleA.keyword.localeCompare(ruleB.keyword);
};

const ViewRules = ({rules, handleEnable, handleDisable, handleDelete} : {rules: ViewRule[], handleEnable: (id: number) => Promise<void>,
  handleDisable: (id: number) => Promise<void>, handleDelete:  (id: number) => Promise<void>}) => {
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [orderBy, setOrderBy] = useState<OrderBy>("default");
  const [hideDisabled, setHideDisabled] = useState(false);

  const visibleRules = useMemo(() => {
    const next = hideDisabled ? rules.filter((rule) => rule.isEnabled) : [...rules];
    if (orderBy !== "default") {
      next.sort((ruleA, ruleB) => sortByField(ruleA, ruleB, orderBy));
    }
    return next;
  }, [hideDisabled, orderBy, rules]);

  const groupedRules = useMemo(() => {
    if (groupBy === "none") {
      return [{ label: null, items: visibleRules }];
    }

    if (groupBy === "actionType") {
      return (["Highlight", "Tag"] as const)
        .map((group) => ({
          label: `Action: ${group}`,
          items: visibleRules.filter((rule) => rule.actionType === group),
        }))
        .filter((group) => group.items.length > 0);
    }

    return (["Contains", "StartsWith", "Exact"] as const)
      .map((group) => ({
        label: `Match Type: ${group}`,
        items: visibleRules.filter((rule) => rule.matchType === group),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupBy, visibleRules]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
        <label className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Group by</span>
          <select
            className="rounded border border-gray-300 bg-white px-2 py-1"
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupBy)}
          >
            <option value="none">None</option>
            <option value="actionType">Action</option>
            <option value="matchType">Match Type</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Order by</span>
          <select
            className="rounded border border-gray-300 bg-white px-2 py-1"
            value={orderBy}
            onChange={(event) => setOrderBy(event.target.value as OrderBy)}
          >
            <option value="default">Default</option>
            <option value="actionType">Action</option>
            <option value="matchType">Match Type</option>
          </select>
        </label>

        <label className="ml-auto flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={hideDisabled}
            onChange={(event) => setHideDisabled(event.target.checked)}
          />
          <span className="font-medium">Hide disabled rules</span>
        </label>
      </div>

      <div className="w-full max-h-96 overflow-x-auto overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
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
            {visibleRules.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                  No rules to display.
                </td>
              </tr>
            )}

            {groupedRules.map((group) => (
              <Fragment key={group.label ?? "all"}>
                {group.label && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {group.label}
                    </td>
                  </tr>
                )}

                {group.items.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold">{rule.keyword}</td>
                    <td className="px-4 py-3">{rule.matchType}</td>
                    <td className="px-4 py-3">{rule.actionType}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        {rule.actionType === "Highlight" ? (
                          <ColorLabel color={rule.highlightColor} />
                        ) : (
                          <TagLabel text={rule.tagText} />
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-3 ">
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
                    <td className="px-4 py-2 flex gap-2 items-center mt-1">
                      {rule.isEnabled ? (
                        <button onClick={()=>handleDisable(rule.id)} className="m-0 cursor-pointer text-gray-500 font-semibold">Disable</button>
                      ): (<button onClick={()=>handleEnable(rule.id)} className="m-0 cursor-pointer text-green-500 font-semibold">Enable</button>)}
                      <button onClick={()=>handleDelete(rule.id)} className="m-0 rounded-md p-0.5 cursor-pointer inline text-white bg-red-500 hover:bg-red-600 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRules;
