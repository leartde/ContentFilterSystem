using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Data.Configurations;

public class RuleConfiguration : IEntityTypeConfiguration<Rule>
{
  public void Configure(EntityTypeBuilder<Rule> builder)
  {
    builder.ToTable("Rules", t =>
    {
      t.HasCheckConstraint(
        "CK_Rules_ActionType_Color_Tag",
        "(ActionType = 1 AND HighlightColor IS NOT NULL AND TagText IS NULL) OR " +
        "(ActionType = 2 AND HighlightColor IS NULL AND TagText IS NOT NULL)"
      );
    });;
    builder.HasKey(r => r.Id);
    builder.Property(r => r.Id)
      .ValueGeneratedOnAdd();
    
    builder.Property(r => r.Keyword)
      .IsRequired();
    
    builder.Property(r => r.MatchType)
      .IsRequired();
    
    builder.HasIndex(r => new { r.Keyword, r.MatchType })
      .IsUnique();
   
  }
  
  
}
