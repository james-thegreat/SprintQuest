# M9 — Security Measures

## Milestone Overview

M9 implements SprintQuest's second selected advanced assessment feature: security measures.

The milestone is intentionally focused on two meaningful and demonstrable protections:

1. Request validation
2. ASP.NET Core rate limiting

Authentication, JWT tokens, user accounts, role-based authorisation, password hashing, and SignalR are outside the scope of this milestone.

## Initial Security Audit

### Audit Scope

The audit reviewed:

* Application-layer request DTOs
* API controllers
* Infrastructure service implementations
* Domain entity validation
* API middleware configuration
* Frontend API error handling
* Existing backend test coverage

### Application Request DTOs

The following request DTOs were reviewed:

* `CreateProjectRequest`
* `UpdateProjectRequest`
* `CreateSprintRequest`
* `UpdateSprintRequest`
* `CreateTaskItemRequest`
* `UpdateTaskItemRequest`
* `CreateChecklistItemRequest`
* `UpdateChecklistItemRequest`

Before M9, these DTOs did not contain validation attributes or dedicated validation logic.

They therefore did not enforce:

* required text fields,
* maximum text lengths,
* non-empty GUID values,
* non-negative numeric values,
* supported enum values,
* valid sprint date ranges.

### Controller Behaviour

The project, sprint, task, and checklist controllers use `[ApiController]`.

This means ASP.NET Core can automatically return `400 Bad Request` when DTO model validation fails.

Before M9, validation was instead performed manually inside controller actions.

Existing manual checks included:

* blank project names,
* blank sprint names,
* blank task titles,
* blank checklist item titles,
* empty project, sprint, and task identifiers,
* negative task story points,
* negative task XP rewards,
* sprint end dates occurring before start dates.

Although these checks provide some protection, they create several weaknesses:

* validation logic is duplicated,
* controllers contain responsibilities that belong with request models,
* errors are returned as plain strings,
* maximum text lengths are not enforced,
* undefined enum values are not explicitly rejected,
* adding more rules would make controllers increasingly difficult to maintain.

### Infrastructure Service Behaviour

The Infrastructure services check whether parent records exist before creating related entities.

Examples include:

* checking that a project exists before creating a sprint,
* checking that a sprint exists before creating a task,
* checking that a task exists before creating a checklist item.

These existence checks are appropriate service-layer responsibilities.

However, the services otherwise trust the incoming request DTO values and pass them directly into Domain constructors or update methods.

The services do not independently enforce:

* maximum text lengths,
* valid enum values,
* request-model constraints.

### Domain Protection

The Domain entities already protect important business invariants.

Existing Domain protection includes:

* rejecting empty parent identifiers,
* rejecting blank names and titles,
* rejecting negative story points,
* rejecting negative XP rewards,
* rejecting a sprint end date before its start date,
* trimming names, titles, and descriptions before storage.

These rules should remain in the Domain layer as defence in depth.

However, the Domain layer does not currently enforce:

* maximum text lengths,
* defined task-status enum values,
* defined priority enum values.

Domain exceptions also do not provide the same client-friendly field-level response as ASP.NET Core request validation.

### Middleware Audit

Before M9, `Program.cs` configures:

* Infrastructure dependencies
* CORS for the local React frontend
* Controllers
* OpenAPI and Scalar
* HTTPS redirection
* CORS middleware
* Authorization middleware
* Controller endpoint mapping

CORS is limited to `http://localhost:5173`, which is safer than allowing every origin.

No ASP.NET Core rate-limiting services or middleware are currently configured.

Specifically, the API does not yet contain:

* `AddRateLimiter`
* a named rate-limiting policy
* `UseRateLimiter`
* a configured `429 Too Many Requests` response

### Frontend API Behaviour

The frontend API client correctly treats non-successful HTTP responses as errors.

However, it currently converts failures into generic messages such as:

```text
API request failed: 400
```

The response body from ASP.NET Core validation is discarded.

Improving frontend error details may be considered after the backend security measures are complete, but backend enforcement remains the trusted security boundary.

### Existing Test Coverage

Before M9, the backend test project contains tests for:

* Domain entities
* gamification behaviour
* achievements
* EF Core database behaviour

There are currently no dedicated tests for:

* request DTO validation,
* automatic `400 Bad Request` responses,
* undefined enum rejection,
* rate-limiting behaviour.

## Identified Risks

The audit identified the following risks:

* excessively long text being persisted,
* invalid numeric enum values entering the application,
* inconsistent validation responses,
* duplicated controller validation,
* Domain exceptions being reached for invalid HTTP input,
* excessive or abusive request traffic,
* unnecessary database and server load,
* limited automated evidence for security behaviour.

## Selected Security Measures

### Security Measure 1 — Request Validation

Request DTO validation will be added in the Application layer.

The intended rules include:

* required names and titles,
* maximum name, title, and description lengths,
* non-empty parent identifiers,
* non-negative story points,
* non-negative XP rewards,
* supported priority values,
* supported task-status values,
* valid sprint date ranges.

Because the controllers use `[ApiController]`, invalid DTOs should automatically produce `400 Bad Request` responses before action methods execute.

Manual validation that becomes redundant will be removed from controllers so they remain thin.

Domain safeguards will remain in place as defence in depth.

### Security Measure 2 — Rate Limiting

ASP.NET Core's built-in rate-limiting middleware will be configured in the API layer.

The policy will:

* use an understandable algorithm,
* support normal frontend usage,
* be easy to demonstrate locally,
* reject excessive traffic with `429 Too Many Requests`,
* avoid external infrastructure or distributed caching.

## Architecture Decision

Validation responsibilities will be divided as follows:

### Application Layer

Responsible for validating the structure and acceptable boundaries of API request DTOs.

Examples:

* required fields,
* text lengths,
* numeric ranges,
* defined enum values,
* cross-field date validation.

### Domain Layer

Responsible for protecting core business invariants regardless of how an entity is created or updated.

Existing Domain safeguards will remain.

### Infrastructure Layer

Responsible for database access and checking whether referenced parent records exist.

### API Layer

Responsible for:

* HTTP model-binding behaviour,
* automatic validation responses,
* rate-limiting registration and middleware,
* translating application outcomes into HTTP status codes.

### Frontend

Responsible for helping users enter valid values and displaying API failures.

The frontend is not trusted as the security boundary because clients can bypass it and call the API directly.

## Scope Decision

M9 will not add:

* authentication,
* JWT bearer tokens,
* user registration,
* password storage or hashing,
* role-based access control,
* SignalR,
* distributed rate limiting,
* Redis.

These features are not required to demonstrate the selected security measures and would create excessive scope for the milestone.

## Planned Verification

The final M9 implementation will be verified using:

```bash
dotnet build backend/SprintQuest.sln
dotnet test backend/SprintQuest.sln
npm run build
```

Manual API verification will demonstrate:

* valid requests still succeed,
* invalid input returns `400 Bad Request`,
* validation errors identify affected fields,
* unsupported enum values are rejected,
* excessive requests return `429 Too Many Requests`,
* requests work again after the rate-limit window resets.

## Assessment Evidence

The two selected M9 security measures are:

1. Request validation
2. ASP.NET Core rate limiting

Together, these measures will complete SprintQuest's second selected advanced assessment feature.




## Final Implementation

### Security Measure 1 — Request Validation

Request validation was added to the important create and update DTOs in the Application layer.

Validated resources include:

* projects,
* sprints,
* tasks,
* checklist items.

Reusable validation attributes were introduced:

* `NotEmptyGuidAttribute`
* `NotWhiteSpaceAttribute`

The implemented rules include:

* required project, sprint, task, and checklist names or titles,
* rejection of whitespace-only values,
* rejection of empty parent identifiers,
* maximum text lengths aligned with EF Core configuration,
* bounded story points,
* bounded XP rewards,
* defined task-status values,
* defined priority values,
* required sprint dates,
* rejection of sprint end dates before start dates.

The final text limits are:

| Resource       | Field       | Maximum length |
| -------------- | ----------- | -------------: |
| Project        | Name        |            100 |
| Project        | Description |          1,000 |
| Sprint         | Name        |            100 |
| Task           | Title       |            200 |
| Task           | Description |          2,000 |
| Checklist item | Title       |            200 |

Because the API controllers use `[ApiController]`, invalid request DTOs automatically return structured `400 Bad Request` responses before controller actions execute.

Manual request validation was removed from the project, sprint, task, and checklist controllers. Parent-record checks and `404 Not Found` responses remain because these represent application outcomes rather than request-format validation.

Domain validation remains in place as defence in depth.

### Security Measure 2 — ASP.NET Core Rate Limiting

ASP.NET Core's built-in rate-limiting middleware was added in the API layer.

The named policy is:

```text
ApiRateLimit
```

The policy uses:

* fixed-window rate limiting,
* 10 permitted requests,
* a 10-second window,
* partitioning by client IP address,
* a queue limit of zero,
* immediate rejection of excessive requests,
* HTTP `429 Too Many Requests`.

The policy is applied to all mapped controller endpoints.

The middleware is positioned after routing and CORS and before controller execution.

This protects SprintQuest from simple request flooding and reduces unnecessary controller, service, database, and gamification processing.

## Important Implementation Files

### Application Layer

* `backend/SprintQuest.Application/Validation/NotEmptyGuidAttribute.cs`
* `backend/SprintQuest.Application/Validation/NotWhiteSpaceAttribute.cs`
* `backend/SprintQuest.Application/DTOs/Projects/CreateProjectRequest.cs`
* `backend/SprintQuest.Application/DTOs/Projects/UpdateProjectRequest.cs`
* `backend/SprintQuest.Application/DTOs/Sprints/CreateSprintRequest.cs`
* `backend/SprintQuest.Application/DTOs/Sprints/UpdateSprintRequest.cs`
* `backend/SprintQuest.Application/DTOs/TaskItems/CreateTaskItemRequest.cs`
* `backend/SprintQuest.Application/DTOs/TaskItems/UpdateTaskItemRequest.cs`
* `backend/SprintQuest.Application/DTOs/ChecklistItems/CreateChecklistItemRequest.cs`
* `backend/SprintQuest.Application/DTOs/ChecklistItems/UpdateChecklistItemRequest.cs`

### API Layer

* `backend/SprintQuest.Api/Program.cs`
* `backend/SprintQuest.Api/Controllers/ProjectsController.cs`
* `backend/SprintQuest.Api/Controllers/SprintsController.cs`
* `backend/SprintQuest.Api/Controllers/TaskItemsController.cs`
* `backend/SprintQuest.Api/Controllers/ChecklistItemsController.cs`

### Tests

* `backend/SprintQuest.Tests/Application/ProjectRequestValidationTests.cs`
* `backend/SprintQuest.Tests/Application/SprintRequestValidationTests.cs`
* `backend/SprintQuest.Tests/Application/TaskRequestValidationTests.cs`
* `backend/SprintQuest.Tests/Application/ChecklistRequestValidationTests.cs`

## Verification Evidence

### Automated Verification

The backend solution successfully built after the security changes:

```bash
dotnet build backend/SprintQuest.sln
```

The complete backend test suite passed:

```text
Total tests: 69
Passed: 69
Failed: 0
Skipped: 0
```

The test suite includes validation coverage for:

* valid requests,
* empty GUID values,
* whitespace-only text,
* maximum-length boundaries,
* values exceeding maximum lengths,
* negative task values,
* undefined enum values,
* missing sprint dates,
* invalid sprint date order.

### Manual Request-Validation Verification

An invalid task request containing:

* an empty sprint ID,
* a whitespace-only title,
* an undefined priority,
* negative story points,
* a negative XP reward,

returned:

```text
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
```

The response contained field-specific validation errors for:

* `SprintId`,
* `Title`,
* `Priority`,
* `StoryPoints`,
* `XpReward`.

A structurally valid task request referencing a sprint that did not exist returned:

```text
HTTP/1.1 404 Not Found
```

This confirmed the separation between request validation and service-level parent-record checks.

### Manual Rate-Limiting Verification

Twelve requests were sent rapidly from the same client.

The results were:

```text
Requests 1–10: HTTP 200 OK
Requests 11–12: HTTP 429 Too Many Requests
```

After waiting eleven seconds for the fixed window to reset, another request returned:

```text
HTTP 200 OK
```

This confirmed that:

* normal API traffic is permitted,
* excessive traffic is rejected,
* rejected requests receive the correct HTTP status,
* normal access resumes after the window resets.

## Scope Confirmation

M9 intentionally did not add:

* authentication,
* JWT tokens,
* user accounts,
* password hashing,
* role-based authorisation,
* SignalR,
* Redis,
* distributed rate limiting.

These features were unnecessary for demonstrating the two selected security measures and would have created excessive milestone scope.
