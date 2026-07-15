using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.DTOs.TaskItems;
using SprintQuest.Domain.Enums;
using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;

namespace SprintQuest.Tests.Application;

public class TaskRequestValidationTests
{
    [Fact]
    public void CreateRequest_WithValidValues_IsValid()
    {
        var request = new CreateTaskItemRequest
        {
            SprintId = Guid.NewGuid(),
            Title = "Implement request validation",
            Description = "Add validation attributes to task requests.",
            Priority = Priority.High,
            StoryPoints = 5,
            XpReward = 50
        };

        var results = Validate(request);

        Assert.Empty(results);
    }

    [Fact]
    public void CreateRequest_WithEmptySprintId_IsInvalid()
    {
        var request = CreateValidRequest();
        request.SprintId = Guid.Empty;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.SprintId)));
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
    public void CreateRequest_WithDescriptionOverMaximumLength_IsInvalid()
    {
        var request = CreateValidRequest();
        request.Description = new string('A', 2001);

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Description)));
    }

    [Fact]
    public void CreateRequest_WithNegativeStoryPoints_IsInvalid()
    {
        var request = CreateValidRequest();
        request.StoryPoints = -1;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.StoryPoints)));
    }

    [Fact]
    public void CreateRequest_WithNegativeXpReward_IsInvalid()
    {
        var request = CreateValidRequest();
        request.XpReward = -1;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.XpReward)));
    }

    [Fact]
    public void CreateRequest_WithUndefinedPriority_IsInvalid()
    {
        var request = CreateValidRequest();
        request.Priority = (Priority)999;

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Priority)));
    }

    [Fact]
    public void UpdateRequest_WithUndefinedStatus_IsInvalid()
    {
        var request = new UpdateTaskItemRequest
        {
            Title = "Update validation",
            Description = null,
            Status = (DomainTaskStatus)999,
            Priority = Priority.Medium,
            StoryPoints = 3,
            XpReward = 30
        };

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Status)));
    }

    private static CreateTaskItemRequest CreateValidRequest()
    {
        return new CreateTaskItemRequest
        {
            SprintId = Guid.NewGuid(),
            Title = "Valid task",
            Description = "Valid description",
            Priority = Priority.Medium,
            StoryPoints = 3,
            XpReward = 30
        };
    }

    private static List<ValidationResult> Validate(object request)
    {
        var validationContext = new ValidationContext(request);
        var validationResults = new List<ValidationResult>();

        Validator.TryValidateObject(
            request,
            validationContext,
            validationResults,
            validateAllProperties: true);

        return validationResults;
    }
}