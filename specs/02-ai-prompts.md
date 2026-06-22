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
