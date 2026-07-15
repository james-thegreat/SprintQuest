using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.DTOs.Sprints;

namespace SprintQuest.Tests.Application;

public class SprintRequestValidationTests
{
    [Fact]
    public void CreateRequest_WithValidValues_IsValid()
    {
        var request = CreateValidRequest();

        var results = Validate(request);

        Assert.Empty(results);
    }

    [Fact]
    public void CreateRequest_WithEmptyProjectId_IsInvalid()
    {
        var request = CreateValidRequest();
        request.ProjectId = Guid.Empty;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(
                nameof(request.ProjectId)));
    }

    [Fact]
    public void CreateRequest_WithWhitespaceName_IsInvalid()
    {
        var request = CreateValidRequest();
        request.Name = "   ";

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Name)));
    }

    [Fact]
    public void CreateRequest_WithNameOverMaximumLength_IsInvalid()
    {
        var request = CreateValidRequest();
        request.Name = new string('A', 101);

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Name)));
    }

    [Fact]
    public void CreateRequest_WithMissingStartDate_IsInvalid()
    {
        var request = CreateValidRequest();
        request.StartDate = default;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(
                nameof(request.StartDate)));
    }

    [Fact]
    public void CreateRequest_WithMissingEndDate_IsInvalid()
    {
        var request = CreateValidRequest();
        request.EndDate = default;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.EndDate)));
    }

    [Fact]
    public void CreateRequest_WithEndDateBeforeStartDate_IsInvalid()
    {
        var request = CreateValidRequest();
        request.EndDate = request.StartDate.AddDays(-1);

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.EndDate)));
    }

    private static CreateSprintRequest CreateValidRequest()
    {
        return new CreateSprintRequest
        {
            ProjectId = Guid.NewGuid(),
            Name = "Security milestone",
            StartDate = new DateTime(2026, 7, 15),
            EndDate = new DateTime(2026, 7, 29)
        };
    }

    private static List<ValidationResult> Validate(object request)
    {
        var context = new ValidationContext(request);
        var results = new List<ValidationResult>();

        Validator.TryValidateObject(
            request,
            context,
            results,
            validateAllProperties: true);

        return results;
    }
}