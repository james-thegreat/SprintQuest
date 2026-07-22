# SprintQuest Testing Plan

## Purpose

SprintQuest uses automated frontend and backend testing to protect important business rules, persistence behaviour, shared frontend state, and key user-visible board behaviour.

Detailed M11 implementation evidence is recorded in:

```text
specs/m11-testing.md
```

## Testing Strategy

SprintQuest follows a practical testing pyramid:

```text
Small number of React component tests
                    ↑
Service and Zustand store behaviour tests
                    ↑
Focused domain and validation unit tests
```

Tests focus on observable behaviour rather than private implementation details.

## Backend Testing

### Tools

- xUnit
- Entity Framework Core
- SQLite in-memory databases
- Microsoft.NET.Test.Sdk
- coverlet collector

### Test Categories

Backend tests cover:

- domain entity construction and validation
- task status and completion rules
- XP event creation
- duplicate XP prevention
- achievement rules
- request DTO validation
- EF Core entity configuration
- `TaskItemService` persistence behaviour
- `GamificationService` summary calculations

### Service Test Approach

Service integration-style tests use:

- the real service implementations
- the real `SprintQuestDbContext`
- the real EF Core SQLite provider
- a fresh isolated in-memory database for each test

This provides more confidence than heavily mocked database tests while keeping the tests fast and independent.

### Backend Commands

Run from the repository root:

```bash
dotnet build backend/SprintQuest.sln
dotnet test backend/SprintQuest.sln
```

## Frontend Testing

### Tools

- Vitest
- React Testing Library
- DOM Testing Library
- Jest-DOM
- jsdom

### Test Categories

Frontend tests cover:

- test-environment configuration
- Zustand task reconciliation
- duplicate task prevention
- task removal by ID
- optimistic status updates
- failed-update rollback
- optimistic deletion
- failed-deletion rollback
- board column rendering
- task grouping by status
- sprint progress
- loading and error messages
- gamification summary content
- task-title validation

### Frontend Test Approach

Zustand actions are tested directly when React rendering does not add value.

React Testing Library is used for user-visible board behaviour.

External boundaries such as REST API functions and the SignalR subscription are mocked. Tests do not connect to a real API, database, or WebSocket server.

### Frontend Commands

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

## SignalR Testing Boundary

SprintQuest does not unit test SignalR framework internals.

Automated tests instead protect SprintQuest-owned behaviour used by the live-board flow:

- authoritative backend task results
- persisted XP behaviour
- Zustand reconciliation
- duplicate prevention
- safe task removal
- optimistic rollback

Real WebSocket behaviour is supported by the completed M10 two-client manual verification.

## Current Verified Results

Verification completed on 22 July 2026:

```text
Backend build: passed
Backend tests: 79 passed
Backend failures: 0
Backend skipped: 0

Frontend test files: 3 passed
Frontend tests: 15 passed
Frontend failures: 0
Frontend production build: passed
Frontend modules transformed: 68
```

## Known Limitations

The current test suite does not include:

- Cypress
- Playwright
- browser end-to-end tests
- visual regression tests
- load testing
- automated multi-client SignalR tests
- deployment-environment tests

These areas are outside the controlled scope of M11.

See `specs/m11-testing.md` for complete implementation details and testing evidence.
