using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[Route("api/rules")]
[ApiController]
public class RuleController : ControllerBase
{
  private readonly ApplicationDbContext _context;

  public RuleController(ApplicationDbContext context)
  {
    _context = context;
  }

  [HttpGet, Route("", Name = "GetRules")]
  public async Task <IActionResult> GetRules()
  {
    var rules = await _context.Rules.ToListAsync();
    var ruleDtos = rules.Select(r => new ViewRuleDto
    (
     r.Id,
     r.Keyword,
     r.MatchType.ToString(),
     r.ActionType.ToString(),
     r.HighlightColor.ToString() ?? "", r.TagText ?? "",
     r.IsEnabled
    ));
    return Ok(ruleDtos);
  }

  [HttpPost, Route("", Name = "CreateRule")]
  public async Task<IActionResult> CreateRule([FromForm] AddRuleDto ruleDto)
  {
    var rule = new Rule
    {
      Keyword = ruleDto.Keyword.ToLower(),
      MatchType = ruleDto.MatchType,
      ActionType = ruleDto.ActionType,
      HighlightColor = ruleDto.HighlightColor,
      TagText = ruleDto.TagText,
    };
    try
    {
      await _context.Rules.AddAsync(rule);
      await _context.SaveChangesAsync();
      return Ok(new ViewRuleDto(rule.Id, rule.Keyword, rule.MatchType.ToString(), rule.ActionType.ToString(), rule.HighlightColor.ToString() ?? "", rule.TagText ?? "", rule.IsEnabled));
    }
    catch (DbUpdateException e)
    {
      return BadRequest(e.InnerException?.Message);
    }
  }

  [HttpGet, Route("{id:int}", Name = "GetRuleById")]
  public async Task<IActionResult> GetRuleById(int id)
  {
    var rule = await _context.Rules.FindAsync(id);
    if (rule is null) return NotFound();
    return Ok(new ViewRuleDto(rule.Id, rule.Keyword, rule.MatchType.ToString(), rule.ActionType.ToString(), rule.HighlightColor.ToString() ?? "", rule.TagText ?? "", rule.IsEnabled));
  }

  [HttpPut, Route("{id:int}", Name = "UpdateRule")]
  public async Task<IActionResult> UpdateRule(int id, [FromForm] UpdateRuleDto updatedRule)
  {
    var rule = await _context.Rules.FindAsync(id);
    if (rule is null) return NotFound();
    rule.Keyword = updatedRule.Keyword;
    rule.MatchType = updatedRule.MatchType;
    rule.ActionType = updatedRule.ActionType;
    rule.HighlightColor = updatedRule.HighlightColor;
    rule.TagText = updatedRule.TagText;
    rule.IsEnabled = updatedRule.IsEnabled;
    await _context.SaveChangesAsync();
    return Ok(new ViewRuleDto(rule.Id, rule.Keyword, rule.MatchType.ToString(), rule.ActionType.ToString(), rule.HighlightColor.ToString() ?? "", rule.TagText ?? "", rule.IsEnabled));
  }

  [HttpDelete, Route("{id:int}", Name = "DeleteRule")]
  public async Task<IActionResult> DeleteRule(int id)
  {
    var rule = await _context.Rules.FindAsync(id);
    if (rule is null) return NotFound();
    _context.Rules.Remove(rule);
    await _context.SaveChangesAsync();
    return NoContent();
  }

  [HttpPatch, Route("{id:int}/disable", Name = "DisableRlule")]
  public async Task<IActionResult> DisableRule(int id)
  {
    var rule = await _context.Rules.FindAsync(id);
    if (rule is null) return NotFound();
    rule.IsEnabled = false;
    await _context.SaveChangesAsync();
    return NoContent();
  }

  [HttpPatch, Route("{id:int}/enable", Name = "EnableRule")]
  public async Task<IActionResult> EnableRule(int id)
  {
    var rule = await _context.Rules.FindAsync(id);
    if (rule is null) return NotFound();
    rule.IsEnabled = true;
    await _context.SaveChangesAsync();
    return NoContent();
  }
}
