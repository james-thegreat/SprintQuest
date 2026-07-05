# M4 - CRUD API & Scalar Docs

## Goal

Milestone 4 adds CRUD API endpoints for the main SprintQuest board resources and exposes interactive API documentation through Scalar.

M3 gave SprintQuest database persistence with EF Core and SQLite. M4 builds on that by allowing clients to create, read, update, and delete data through HTTP endpoints.

## Completed Scope

### Project CRUD

Implemented CRUD endpoints for projects.

Endpoints:

- `GET /api/projects`
- `GET /api/projects/{id}`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

Files added:

- `SprintQuest.Application/DTOs/Projects/ProjectDto.cs`
- `SprintQuest.Application/DTOs/Projects/CreateProjectRequest.cs`
- `SprintQuest.Application/DTOs/Projects/UpdateProjectRequest.cs`
- `SprintQuest.Application/Interfaces/IProjectService.cs`
- `SprintQuest.Infrastructure/Services/ProjectService.cs`
- `SprintQuest.Api/Controllers/ProjectsController.cs`

Domain update:

- Added `Project.UpdateDetails(...)` so project name and description updates stay inside the domain entity.

### Sprint CRUD

Implemented CRUD endpoints for sprints.

Endpoints:

- `GET /api/sprints`
- `GET /api/sprints/project/{projectId}`
- `GET /api/sprints/{id}`
- `POST /api/sprints`
- `PUT /api/sprints/{id}`
- `DELETE /api/sprints/{id}`

Files added:

- `SprintQuest.Application/DTOs/Sprints/SprintDto.cs`
- `SprintQuest.Application/DTOs/Sprints/CreateSprintRequest.cs`
- `SprintQuest.Application/DTOs/Sprints/UpdateSprintRequest.cs`
- `SprintQuest.Application/Interfaces/ISprintService.cs`
- `SprintQuest.Infrastructure/Services/SprintService.cs`
- `SprintQuest.Api/Controllers/SprintsController.cs`

Notes:

- Sprint creation validates that the parent project exists.
- Sprint update uses existing domain methods `Rename(...)` and `UpdateDates(...)`.

### TaskItem CRUD

Implemented CRUD endpoints for task cards.

Endpoints:

- `GET /api/taskitems`
- `GET /api/taskitems/sprint/{sprintId}`
- `GET /api/taskitems/{id}`
- `POST /api/taskitems`
- `PUT /api/taskitems/{id}`
- `DELETE /api/taskitems/{id}`

Files added:

- `SprintQuest.Application/DTOs/TaskItems/TaskItemDto.cs`
- `SprintQuest.Application/DTOs/TaskItems/CreateTaskItemRequest.cs`
- `SprintQuest.Application/DTOs/TaskItems/UpdateTaskItemRequest.cs`
- `SprintQuest.Application/Interfaces/ITaskItemService.cs`
- `SprintQuest.Infrastructure/Services/TaskItemService.cs`
- `SprintQuest.Api/Controllers/TaskItemsController.cs`

Domain update:

- Added `TaskItem.UpdateDetails(...)` so title, description, priority, story points, and XP reward updates stay inside the domain entity.
- Task status updates use `MoveToStatus(...)`.

Notes:

- `TaskStatus` conflicts with `System.Threading.Tasks.TaskStatus`, so the DTOs use an alias:
  - `using DomainTaskStatus = SprintQuest.Domain.Enums.TaskStatus;`

### ChecklistItem CRUD

Implemented CRUD endpoints for checklist items.

Endpoints:

- `GET /api/checklistitems`
- `GET /api/checklistitems/task/{taskItemId}`
- `GET /api/checklistitems/{id}`
- `POST /api/checklistitems`
- `PUT /api/checklistitems/{id}`
- `DELETE /api/checklistitems/{id}`

Files added:

- `SprintQuest.Application/DTOs/ChecklistItems/ChecklistItemDto.cs`
- `SprintQuest.Application/DTOs/ChecklistItems/CreateChecklistItemRequest.cs`
- `SprintQuest.Application/DTOs/ChecklistItems/UpdateChecklistItemRequest.cs`
- `SprintQuest.Application/Interfaces/IChecklistItemService.cs`
- `SprintQuest.Infrastructure/Services/ChecklistItemService.cs`
- `SprintQuest.Api/Controllers/ChecklistItemsController.cs`

Notes:

- Checklist item creation validates that the parent task item exists.
- Checklist update uses `Rename(...)`, `Complete(...)`, and `Reopen(...)`.
- Completing a checklist item sets `CompletedAt`.

### Scalar API Documentation

Added interactive Scalar documentation for the API.

Files changed:

- `SprintQuest.Api/SprintQuest.Api.csproj`
- `SprintQuest.Api/Program.cs`

Packages added or updated:

- `Scalar.AspNetCore`
- `Microsoft.OpenApi` updated to patched version to avoid vulnerability warnings.

Scalar URL:

- `http://localhost:5087/scalar`

OpenAPI document URL:

- `http://localhost:5087/openapi/v1.json`

## Architecture Notes

M4 follows the existing Clean Architecture structure:

- `Domain` contains entities and business rules.
- `Application` contains DTOs and service interfaces.
- `Infrastructure` contains EF Core service implementations.
- `Api` contains HTTP controllers.

Controllers should stay thin. Their job is to:

- validate simple request problems
- call the service
- return the correct HTTP response

Services coordinate EF Core database access and map entities to DTOs.

Domain entities keep their own rule-based update methods, such as:

- `Project.UpdateDetails(...)`
- `TaskItem.UpdateDetails(...)`
- `Sprint.Rename(...)`
- `Sprint.UpdateDates(...)`
- `ChecklistItem.Complete(...)`

## Manual Verification

The following workflows were manually tested with `curl`:

### Project

- Created a project.
- Listed projects.
- Updated a project.
- Deleted a project.
- Recreated a project for later testing.

### Sprint

- Created a sprint for a valid project.
- Listed sprints.
- Listed sprints by project ID.
- Updated a sprint.
- Deleted a sprint.
- Recreated a sprint for later testing.

### TaskItem

- Created a task item for a valid sprint.
- Listed task items.
- Listed task items by sprint ID.
- Updated a task item.
- Deleted a task item.
- Recreated a task item for later testing.

### ChecklistItem

- Created a checklist item for a valid task item.
- Listed checklist items.
- Listed checklist items by task item ID.
- Updated a checklist item to completed.
- Confirmed `CompletedAt` was set.
- Deleted a checklist item.
- Recreated a checklist item for later testing.

## Verification Commands

Run from the `backend` folder:

```bash
dotnet build
dotnet test
dotnet list package --vulnerable --include-transitive
dotnet run --project SprintQuest.Api