using api.Enums;
using MatchType = System.IO.MatchType;

namespace api.DTOs;

public record ViewRuleDto(int Id, string Keyword, string MatchType, string ActionType, string HighlightColor, string TagText, bool IsEnabled);
