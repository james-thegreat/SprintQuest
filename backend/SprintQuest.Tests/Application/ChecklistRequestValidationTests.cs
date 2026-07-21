using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.DTOs.ChecklistItems;

namespace SprintQuest.Tests.Application;

public class ChecklistRequestValidationTests
{
    [Fact]
    public void CreateRequest_WithValidValues_IsValid()
    {
        var request = new CreateChecklistItemRequest
        {
            TaskItemId = Guid.NewGuid(),
            Title = "Verify security behaviour"
        };

        var results = Validate(request);

        Assert.Empty(results);
    }

    [Fact]
    public void CreateRequest_WithEmptyTaskItemId_IsInvalid()
    {
        var request = CreateValidRequest();
        request.TaskItemId = Guid.Empty;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(
                nameof(request.TaskItemId)));
    }

    [Fact]
    public void CreateRequest_WithWhitespaceTitle_IsInvalid()
    {
        var request = CreateValidRequest();
        request.Title = "   ";

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Title)));
    }

    [Fact]
    public void CreateRequest_WithTitleOverMaximumLength_IsInvalid()
    {
        var request = CreateValidRequest();
        request.Title = new string('A', 201);

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Title)));
    }

    [Fact]
    public void UpdateRequest_WithMaximumTitleLength_IsValid()
    {
        var request = new UpdateChecklistItemRequest
        {
            Title = new string('A', 200),
            IsCompleted = true
        };

        var results = Validate(request);

        Assert.Empty(results);
    }

    private static CreateChecklistItemRequest CreateValidRequest()
    {
        return new CreateChecklistItemRequest
        {
            TaskItemId = Guid.NewGuid(),
            Title = "Valid checklist item"
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