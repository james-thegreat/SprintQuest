# M2 - Core Domain Models

## Purpose

Milestone 2 establishes the core business objects and rules used by SprintQuest before database and API functionality is added.

## Domain Entities

SprintQuest currently contains:

- Project
- Sprint
- TaskItem
- ChecklistItem
- Achievement
- XpEvent

The main ownership structure is:

Project -> Sprint -> TaskItem -> ChecklistItem

Achievement and XpEvent support future gamification features.

## Entities vs DTOs

Entities represent core business concepts. They have identity, state, validation, and behaviour.

DTOs transfer data between the API and its clients. DTOs will be added during the API milestone and should not contain core business rules.

## Domain Behaviour

Business rules belong in the Domain layer so they remain protected regardless of whether an operation begins through the API, tests, or another interface.

Examples include:

- Project and sprint names cannot be empty.
- Sprint end dates cannot occur before their start dates.
- Tasks can move between board statuses.
- Completing a task sets its status to Done and records CompletedAt.
- Reopening a task clears CompletedAt.
- Checklist items can be completed and reopened.
- XP awards must be greater than zero.

## Encapsulation

Entity properties use private setters. Important changes are performed through methods such as:

- Rename()
- AddSprint()
- MoveToStatus()
- Complete()
- Reopen()
- AddChecklistItem()

This prevents external code from placing entities into invalid states.

## Clean Architecture

The Domain project does not depend on the API, EF Core, or database code.

Future milestones will use these models as follows:

- Application coordinates use cases involving the entities.
- Infrastructure maps and saves entities using EF Core.
- API exposes functionality through endpoints and DTOs.
- Frontend displays projects, sprints, tasks, and gamification progress.

## Testing

Unit tests cover entity creation, validation, ownership relationships, task completion, task reopening, status changes, checklist behaviour, achievements, and XP events.