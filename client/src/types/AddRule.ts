export type AddRuleForm = {
  keyword: string;
  matchType: 1 | 2 | 3; // 1: Contains, 2: StartsWith, 3: Exact
  actionType: 1 | 2; // 1: Highlight, 2: Tag
  highlightColor?: 1 | 2 | 3 | 4 | 5; // 1: Blue, 2: Green, 3: Yellow, 4: Orange, 5: Red
  tagText?: string;
}
