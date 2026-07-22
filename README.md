# SprintQuest

SprintQuest is a gamified project development canvas board built for the Microsoft Student Accelerator 2026 Phase 2 Software Stream.

The app helps users plan software projects using projects, sprints, task cards, checklist items, task statuses, XP rewards, achievements, progress tracking, and milestone completion.

SprintQuest is inspired by tools like Trello and Jira, but it is focused on helping students and developers stay motivated while learning software project development.

---

## Project Purpose

The goal of SprintQuest is to make project planning feel more engaging by adding gamification features to a project management workflow.

Users can create projects, organise work into sprints, move tasks through board columns, complete checklist items, earn XP, unlock achievements, and track sprint progress.

---

## Gamification Theme

SprintQuest connects to the gamification theme by adding game-like rewards to a non-game application.

Planned gamification features include:

* XP rewards for completing tasks
* XP rewards for ticking checklist items
* Achievements and badges
* Sprint progress bars
* Project progress tracking
* Completion bonuses
* Streaks or momentum tracking if time allows

---

## Planned Tech Stack

### Backend

* C#
* .NET 10 or higher
* ASP.NET Core Web API
* Entity Framework Core
* SQL database
* Clean Architecture
* Scalar API documentation
* xUnit backend tests

### Frontend

* React
* TypeScript
* Vite
* React Router
* Zustand state management
* Vitest
* React Testing Library

---

## Architecture

The backend will use a Clean Architecture-style structure:

```text
backend/
  SprintQuest.Api
  SprintQuest.Application
  SprintQuest.Domain
  SprintQuest.Infrastructure
  SprintQuest.Tests
```

The frontend will use a feature-based React structure:

```text
frontend/
  sprintquest-ui/
    src/
      api/
      components/
      features/
      pages/
      routes/
      stores/
      types/
      utils/
      tests/
```

---

## Advanced Features

The top three advanced features selected for assessment are:

* [x] **State management library — Zustand**

  * Shared board and gamification state is managed through dedicated Zustand stores.
  * See `specs/m8-zustand-state-management.md`.

* [x] **Security measures — request validation and rate limiting**

  * Application-layer DTO validation rejects malformed, oversized, and unsupported input with structured `400 Bad Request` responses.
  * ASP.NET Core rate limiting allows 10 controller requests per client IP during each 10-second window.
  * Excessive requests return `429 Too Many Requests`.
  * See `specs/m9-security-measures.md`.

* [x] **WebSockets — SignalR live board updates**

  * ASP.NET Core SignalR synchronizes task creation, task updates, status movement, and task deletion across connected browser clients.
  * Incoming events are reconciled through Zustand by task ID to prevent duplicate task cards.
  * Gamification summaries refresh after relevant live task updates.
  * Automatic reconnection restores the live-board connection after temporary backend interruptions.
  * Two-client testing confirmed that board changes appear without manually refreshing the page.
  * See `specs/m10-signalr-live-board.md`.


Optional extra if time allows:

* [ ] Theme switching


---

## Core Features

Planned core features include:

* [ ] Create, view, update, and delete projects
* [ ] Create, view, update, and delete sprints
* [ ] Create, view, update, and delete task cards
* [ ] Create, update, and delete checklist items
* [ ] Move tasks between statuses
* [ ] Track sprint progress
* [ ] Award XP for progress
* [ ] Unlock achievements

---

## API Documentation

The backend will use Scalar API documentation instead of Swagger UI.

Deployment link will be added later.

---

## Deployment Links

Frontend:

```text
Coming soon
```

Backend:

```text
Coming soon
```

---

## Testing

SprintQuest includes automated backend and frontend tests covering domain rules, request validation, persistence-related service behaviour, Zustand state management, optimistic rollback, and key sprint-board UI behaviour.

### Backend

Run from the repository root:

```bash
dotnet build backend/SprintQuest.sln
dotnet test backend/SprintQuest.sln
```

Current verified result:

```text
79 tests passed
0 tests failed
0 tests skipped
```

### Frontend

Run from the frontend project:

```bash
cd frontend/sprintquest-ui
npm test
npm run build
```

Watch mode:

```bash
npm run test:watch
```

Current verified result:

```text
3 test files passed
15 tests passed
0 tests failed
Production build passed
```

See [`specs/m11-testing.md`](specs/m11-testing.md) for the complete testing strategy, commands, evidence, and known limitations.

---

## Setup Instructions

Setup instructions will be added as the backend and frontend are created.

---

## AI Usage

AI was used as a learning and planning assistant during development.

AI support included:

* project planning
* milestone breakdown
* architecture discussion
* GitHub issue creation
* code explanation
* debugging support
* README and documentation drafting

Detailed AI prompts and decisions are stored in the `/specs` folder.

---

## Self-Reflection

This section will be completed near the end of the project.

It will reflect on:

* what was learned
* how AI was used
* technical challenges
* design decisions
* what could be improved in the future
