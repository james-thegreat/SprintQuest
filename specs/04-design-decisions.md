# Design Decisions

This file records important design decisions made during the project.

## M1 Design Decision - Clean Architecture Backend Structure

For the backend, SprintQuest uses a Clean Architecture-style project structure.

The reason for this decision is to keep the project maintainable as it grows. SprintQuest will eventually include projects, sprints, tasks, checklist items, XP rewards, achievements, security, EF Core persistence, and SignalR live updates. Separating the backend into layers helps prevent the API or database code from becoming mixed with the core business rules.

The Domain layer is kept independent because it should contain the most important business logic. For example, rules such as completing a task, awarding XP, or unlocking achievements should be testable without needing a database or web API.

The Application layer will coordinate use cases and DTOs. The Infrastructure layer will handle EF Core and database access. The Api layer will expose endpoints and configure the application.

This structure also supports testing because domain and application logic can be tested separately from controllers and database code.