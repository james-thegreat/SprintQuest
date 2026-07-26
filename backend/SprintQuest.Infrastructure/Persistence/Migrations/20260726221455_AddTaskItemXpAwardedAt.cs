using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SprintQuest.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskItemXpAwardedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "XpAwardedAt",
                table: "TaskItems",
                type: "TEXT",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE TaskItems
                SET XpAwardedAt = CompletedAt
                WHERE CompletedAt IS NOT NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "XpAwardedAt",
                table: "TaskItems");
        }
    }
}
