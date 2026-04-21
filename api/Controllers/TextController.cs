using System.Text.RegularExpressions;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using MatchType = api.Enums.MatchType;

namespace api.Controllers;

[ApiController]
[Route("api/text")]
public class TextController : ControllerBase
{
  private readonly ApplicationDbContext _context;

  public TextController(ApplicationDbContext context)
  {
    _context = context;
  }

  [HttpGet, Route("{input}")]
  public IActionResult ProcessText(string input)
  {
    var words = SeparateWords(input);
    List<ProcessedTextDto> matches = [];
    foreach (var word in words)
    {
      var match = CheckMatchingRules(word);
      if (match is not null)
      {
        matches.Add(match);
      }
    }

    return Ok(matches);
  }

  private List<string> SeparateWords(string input)
  {
    return input
      .ToLower()
      .Split(' ', StringSplitOptions.RemoveEmptyEntries)
      .Select(word => Regex.Replace(word, @"[^\w]", ""))
      .Where(word => !string.IsNullOrWhiteSpace(word))
      .ToList();
  }

  private ProcessedTextDto? CheckMatchingRules(string word)
  {
    Rule? specificRule = null;
    var rules = _context.Rules.Where(r => r.IsEnabled).ToList();
    foreach (var rule in rules)
    {
      if (rule.IsEnabled && word.Contains(rule.Keyword))
      {
        if (word.Equals(rule.Keyword) && rule.MatchType == MatchType.Exact)
        {
          specificRule = rule;
          break;
        }

        if (word.StartsWith(rule.Keyword) && rule.MatchType == MatchType.StartsWith)
        {
          specificRule = rule;
        }

        else if (specificRule?.MatchType != MatchType.Exact && specificRule?.MatchType != MatchType.StartsWith &&
                 rule.MatchType == MatchType.Contains)
        {
          specificRule = rule;
        }
      }
    }

    return specificRule != null ? new ProcessedTextDto(word, specificRule.HighlightColor.ToString(), specificRule.TagText) : null;
  }
}
