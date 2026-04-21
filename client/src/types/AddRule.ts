export type AddRuleForm =
  | {
  keyword: string;
  matchType: 1 | 2 | 3;
  actionType: 1;
  highlightColor: 1 | 2 | 3 | 4 | 5;
  tagText: null;
}
  | {
  keyword: string;
  matchType: 1 | 2 | 3;
  actionType: 2;
  highlightColor: null;
  tagText: string;
};
