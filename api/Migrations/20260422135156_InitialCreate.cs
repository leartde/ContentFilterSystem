using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Keyword = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MatchType = table.Column<int>(type: "int", nullable: false),
                    ActionType = table.Column<int>(type: "int", nullable: false),
                    HighlightColor = table.Column<int>(type: "int", nullable: true),
                    TagText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rules", x => x.Id);
                    table.CheckConstraint("CK_Rules_ActionType_Color_Tag", "(ActionType = 1 AND HighlightColor IS NOT NULL AND TagText IS NULL) OR (ActionType = 2 AND HighlightColor IS NULL AND TagText IS NOT NULL)");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rules_Keyword_MatchType",
                table: "Rules",
                columns: new[] { "Keyword", "MatchType" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rules");
        }
    }
}
