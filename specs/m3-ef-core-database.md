# M3 - EF Core Database

## Purpose

Milestone 3 adds database persistence to SprintQuest using Entity Framework Core and SQLite.

The goal of this milestone is to make the Domain models persistable without placing database concerns inside the Domain layer.

## Persistence Technology

SprintQuest currently uses:

- Entity Framework Core
- SQLite
- EF Core migrations
- EF Core entity configuration classes

SQLite is used initially because it is lightweight, simple to run locally, and suitable for early project development.

## Clean Architecture

Database implementation details belong in the Infrastructure layer.

The Domain layer does not reference EF Core and does not contain database attributes.

Layer responsibilities for this milestone:

- Domain contains entities and business rules.
- Infrastructure contains the DbContext, entity mappings, and migrations.
- API contains runtime configuration and calls Infrastructure dependency registration.
- Tests verify the EF Core model configuration.

## DbContext

The EF Core database context is:

```text
SprintQuest.Infrastructure/Persistence/SprintQuestDbContext.cs