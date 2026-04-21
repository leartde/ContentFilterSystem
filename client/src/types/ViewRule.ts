export type ViewRule = {
  id: number;
  keyword: string;
  matchType: "Contains" | "StartsWith" | "Exact"
  actionType: "Highlight" | "Tag"
  highlightColor: "Blue" | "Green" | "Yellow" | "Orange" | "Red" ;
  tagText: string;
  isEnabled: boolean;
}
