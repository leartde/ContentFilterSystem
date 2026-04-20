using api.Enums;
using MatchType = api.Enums.MatchType;

namespace api.DTOs;

public record UpdateRuleDto(string Keyword, MatchType MatchType, ActionType ActionType, HighlightColor? HighlightColor, string TagText, bool IsEnabled);
