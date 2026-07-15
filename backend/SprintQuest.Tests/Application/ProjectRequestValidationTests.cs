using System.ComponentModel.DataAnnotations;
using SprintQuest.Application.DTOs.Projects;

namespace SprintQuest.Tests.Application;

public class ProjectRequestValidationTests
{
    [Fact]
    public void CreateRequest_WithValidValues_IsValid()
    {
        var request = new CreateProjectRequest
        {
            Name = "SprintQuest",
            Description = "A gamified project development board."
        };

        var results = Validate(request);

        Assert.Empty(results);
    }

    [Fact]
    public void CreateRequest_WithWhitespaceName_IsInvalid()
    {
        var request = new CreateProjectRequest
        {
            Name = "   "
        };

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Name)));
    }

    [Fact]
    public void CreateRequest_WithNameOverMaximumLength_IsInvalid()
    {
        var request = new CreateProjectRequest
        {
            Name = new string('A', 101)
        };

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Name)));
    }

    [Fact]
    public void CreateRequest_WithDescriptionOverMaximumLength_IsInvalid()
    {
        var request = new CreateProjectRequest
        {
            Name = "Valid project",
            Description = new string('A', 1001)
        };

        var results = Validate(request);

        Assert.Contains(
            results,
            result => result.MemberNames.Contains(nameof(request.Description)));
    }

    [Fact]
    public void UpdateRequest_WithValidBoundaryLengths_IsValid()
    {
        var request = new UpdateProjectRequest
        {
            Name = new string('A', 100),
            Description = new string('B', 1000)
        };

        var results = Validate(request);

        Assert.Empty(results);
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