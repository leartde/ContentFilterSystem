using api.Enums;
using MatchType = api.Enums.MatchType;


namespace api.Models;

public class Rule
{
  public int Id { get; set; }
  public string Keyword { get; set; } = string.Empty;
  public MatchType MatchType { get; set; }
  public ActionType ActionType { get; set; }
  public HighlightColor? HighlightColor { get; set; }
  public string? TagText { get; set; }
  public bool IsEnabled { get; set; } = true;
}
