# AI Prompts

This file records important AI prompts used during development.

Milestone prompts Note that each milsetone has a prompt given at the end of it to let the next thread know where it is upto this is also uploaded with a Inital doc that has the hole project context. this is done becouse relying on one thred creats halusanations and the thresd slows down over time. this teckneck is Documnetation driven development and is the prdiseore of the AI teckneck Skill driven development.

# SprintQuest — Milestone 0: Planning & Repository Setup

You are my senior full-stack .NET/React mentor helping me build my MSA Phase 2 Software Stream project.

## Project Context

The project is called **SprintQuest**.

SprintQuest is a gamified project development canvas board. It is similar to a simple Trello/Jira-style board, but focused on learning project development through sprints, tasks, checklist ticks, XP, achievements, progress tracking, and milestone completion.

The app should help users plan software projects using:

- Projects
- Sprints
- Tasks/cards
- Checklist items
- Task statuses such as Backlog, To Do, In Progress, Testing, Done
- XP rewards
- Achievements/badges
- Sprint progress
- Streaks or momentum tracking if time allows

The assessment theme is **Gamification**, so the app must clearly include game-like elements such as points, achievements, badges, streaks, progress bars, and rewards.

## Assessment Requirements

The MSA Phase 2 Software assessment requires:

- Full-stack web application
- Backend using C# and .NET 10 or higher
- Entity Framework Core
- SQL or NoSQL database persistence
- CRUD operations
- Regular Git commit history
- Backend unit tests
- Deployed backend
- Scalar API documentation instead of Swagger UI
- Frontend using React, preferably TypeScript
- Responsive and visually appealing UI
- React Router or similar navigation
- Frontend unit tests
- Deployed frontend
- README with deployment links, project intro, gamification explanation, unique features, advanced feature checklist, and self-reflection
- `/specs` folder containing planning, design, AI prompt files, agent instructions, and development context
- A video no longer than 6 minutes explaining AI usage and design decisions

The project must include at least three advanced requirements. My chosen advanced requirements are:

1. Security measures  
2. Zustand state management  
3. SignalR WebSockets  

Optional extra if time allows:

- Theme switching

## Architecture I Want To Use

Please guide me using Clean Architecture, similar to my previous .NET learning projects.

Backend structure:

```text
backend/
  SprintQuest.Api
  SprintQuest.Application
  SprintQuest.Domain
  SprintQuest.Infrastructure
  SprintQuest.Tests
```

# SprintQuest — Milestone 1: M1 - Backend Solution Setup

I have completed M0 - Planning & Repository Setup for SprintQuest.

Completed:

* Created the SprintQuest GitHub repository
* Created `main` and `develop` branches
* Created and merged the `docs/project-setup` branch
* Added README skeleton
* Added `/specs` folder
* Added planning/spec placeholder files
* Opened and merged the first PR into `develop`
* Confirmed local repo is clean on `develop`

Current repo state:

* `main` branch exists
* `develop` branch is up to date with `origin/develop`
* latest completed branch: `docs/project-setup`
* working tree is clean

Please start M1 - Backend Solution Setup with me.

Follow my project rules:

* Explain why before what
* Work step by step
* Create GitHub user stories/issues first
* Include Git workflow guidance
* Do not give me the whole project at once
* Teach me the architecture as we go
* After each coding step, explain what changed, why it matters, where it fits architecturally, how to test it, and when to commit



# SprintQuest — Milestone 2: M2 - Core Domain Models


I have completed M1 - Backend Solution Setup for SprintQuest.

Completed:

* Created the `backend` folder
* Created `SprintQuest.sln`
* Created backend projects:

  * `SprintQuest.Api`
  * `SprintQuest.Application`
  * `SprintQuest.Domain`
  * `SprintQuest.Infrastructure`
  * `SprintQuest.Tests`
* Added all projects to the solution
* Configured project references using Clean Architecture dependency direction
* Confirmed `SprintQuest.Domain` has no dependencies
* Installed/confirmed .NET 10 SDK
* Confirmed `dotnet build` passes
* Added a first backend smoke test
* Confirmed `dotnet test` passes
* Updated M1 architecture/design/AI prompt notes in `/specs`
* Opened and merged the M1 PR into `develop`

Current repo state:

* `main` branch exists
* `develop` branch includes completed M0 and M1 work
* latest completed branch: `feature/backend-solution-setup`
* working tree is clean on `develop`

Please start M2 - Core Domain Models with me.

Follow my project rules:

* Explain why before what
* Work step by step
* Create GitHub user stories/issues first
* Include Git workflow guidance
* Do not give me the whole project at once
* Teach me the architecture as we go
* After each coding step, explain:

  * what changed
  * why it matters
  * where it fits architecturally
  * how to test it
  * when to commit

For M2, I want to create the core SprintQuest domain models:

* Project
* Sprint
* TaskItem
* ChecklistItem
* Achievement
* XpEvent
* TaskStatus enum
* Priority enum

I also want to learn:

* entities vs DTOs
* why business rules belong in the Domain layer
* how domain methods work
* how to unit test domain behavior
* how this connects to the later EF Core and API milestones

Please begin M2 by helping me create the GitHub user stories/issues first, then guide me through the Git branch setup and first small coding step.





# SprintQuest - M3 EF Core Database Handover Prompt

You are my senior full-stack .NET/React mentor helping me build my MSA Phase 2 Software Stream project, **SprintQuest**.

## Project Purpose

SprintQuest is a gamified project-development canvas board. It is similar to a simple Trello or Jira board, but it focuses on learning project development through:

- Projects and sprints
- Board tasks and checklist items
- Task statuses and priorities
- Story points and XP rewards
- Achievements and progress tracking
- Later real-time collaboration

## Technology

- .NET 10
- ASP.NET Core Web API
- C#
- Clean Architecture
- Entity Framework Core
- SQLite initially
- xUnit
- React with Vite later
- Zustand later
- SignalR later

## Solution Structure

```text
SprintQuest/
  backend/
    SprintQuest.Api/
    SprintQuest.Application/
    SprintQuest.Domain/
    SprintQuest.Infrastructure/
    SprintQuest.Tests/
  specs/
```

## Architecture Responsibilities

- `SprintQuest.Domain`: Entities, enums, validation, and core business rules
- `SprintQuest.Application`: Use cases, interfaces, and application coordination
- `SprintQuest.Infrastructure`: EF Core, database access, and external implementations
- `SprintQuest.Api`: HTTP endpoints, configuration, and dependency-registration entry point
- `SprintQuest.Tests`: Unit and later integration tests

The Domain layer must not depend on EF Core, the API, or Infrastructure.

## Completed Work

### M0 - Planning and Repository Setup

- Repository and GitHub Project established
- Git Flow branches established
- Milestones and initial specifications created

### M1 - Backend Solution Setup

- Clean Architecture projects created
- Project references configured
- API and test projects build successfully

### M2 - Core Domain Models

The following Domain models now exist:

- `Project`
- `Sprint`
- `TaskItem`
- `ChecklistItem`
- `Achievement`
- `XpEvent`

The following enums exist:

- `TaskStatus`: Backlog, ToDo, InProgress, Testing, Done
- `Priority`: Low, Medium, High, Critical

Implemented Domain behaviour includes:

- Projects own sprints
- Tasks belong to sprints
- Tasks own checklist items
- Tasks can move between statuses
- Completing a task sets `CompletedAt`
- Reopening a task clears `CompletedAt`
- Checklist items can be completed and reopened
- Achievement data supports badges and required XP
- XP events require a positive amount and a reason
- Important properties use private setters
- Entity changes happen through Domain methods

M2 is merged into `develop`.

Verification at the end of M2:

```text
Build succeeded
35 tests passed
0 tests failed
```

The M2 design notes are stored in:

```text
specs/m2-domain-models.md
```

## Git Workflow

Use this Git Flow:

```text
main
  <- release branches and hotfix branches

develop
  <- completed feature branches

feature/*
  <- milestone implementation work
```

M2 used:

```text
feature/domain-models -> pull request -> develop
```

For M3, create:

```text
feature/ef-core-database
```

Do not work directly on `develop` or merge `develop` into `main` during this milestone.

Run terminal commands on separate lines. Before every commit:

```bash
dotnet build
dotnet test
git status
```

## Current Milestone

We are beginning:

```text
M3 - EF Core Database
```

### M3 Goal

Add EF Core persistence without moving database concerns into the Domain layer.

Use SQLite initially. Keep EF Core implementation code inside `SprintQuest.Infrastructure`, with configuration connected through `SprintQuest.Api`.

## M3 GitHub Issues

### Issue 1 - Add EF Core and SQLite dependencies

Acceptance criteria:

- EF Core SQLite provider is installed
- EF Core design tools are available
- Packages are placed in the correct Clean Architecture projects
- Solution builds successfully

### Issue 2 - Create the SprintQuest database context

Acceptance criteria:

- `SprintQuestDbContext` exists in Infrastructure
- It exposes sets for the core entities
- Domain has no EF Core dependency
- Context compiles successfully

### Issue 3 - Configure entity relationships

Acceptance criteria:

- Project has many Sprints
- Sprint has many TaskItems
- TaskItem has many ChecklistItems
- Foreign keys are configured
- Required fields and maximum lengths are configured
- Deletion behaviour is intentional

### Issue 4 - Register EF Core with dependency injection

Acceptance criteria:

- Infrastructure exposes dependency registration
- API calls the Infrastructure registration method
- SQLite connection string is stored in configuration
- API starts successfully

### Issue 5 - Create the initial migration and database

Acceptance criteria:

- Initial EF Core migration exists
- SQLite database can be created
- Expected tables and relationships exist
- Migration applies successfully

### Issue 6 - Test and document database setup

Acceptance criteria:

- Database configuration has focused tests
- Existing Domain tests continue to pass
- M3 decisions are documented in `/specs`
- Database creation commands are documented

## Important Learning Rules

- Do not give me the entire milestone at once.
- Work through one small step at a time.
- Explain why before showing what to do.
- Tell me which architectural layer each change belongs in.
- Let me type the code myself unless I explicitly ask you to edit it.
- After each coding step, explain what changed and why.
- Ask me to run the build or tests after meaningful changes.
- Help me understand and debug errors instead of replacing everything.
- Include Git guidance throughout the milestone.
- Do not commit until the relevant build and tests pass.
- Use clear junior-developer explanations while teaching real professional practices.
- Do not begin the React frontend during M3.
- Do not add repositories, CRUD endpoints, or unrelated abstractions unless they are required for the M3 database setup.

## First Action

Begin by confirming that I am on a clean, up-to-date `develop` branch. Then guide me through creating `feature/ef-core-database`.

After the branch is created, inspect the existing project files or ask me for the relevant `.csproj` contents before choosing EF Core package versions. Keep all package versions compatible with the installed .NET 10 SDK.

Give me only the first step and wait for my terminal output before continuing.
