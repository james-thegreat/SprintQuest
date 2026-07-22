# SprintQuest — M11 Testing

## Overview

M11 establishes and strengthens automated frontend and backend testing for SprintQuest.

Before this milestone, SprintQuest already had backend xUnit coverage for domain entities, validation rules, achievement rules, XP events, and EF Core model configuration. However, service-level persistence behaviour was not directly tested, and the React frontend had no configured automated testing environment.

M11 adds meaningful tests for existing behaviour without introducing unrelated application features.

## Milestone Goals

The goals of M11 were to:

* audit existing backend and frontend test coverage
* add backend service tests for task and gamification behaviour
* configure frontend testing with Vitest and React Testing Library
* test Zustand reconciliation and optimistic rollback
* test important sprint-board UI behaviour
* document testing tools, commands, results, and limitations
* verify that all tests and production builds pass

## Testing Strategy

SprintQuest uses a testing pyramid appropriate for the current application:

```text
Small number of React component tests
                    ↑
Service and Zustand store behaviour tests
                    ↑
Focused domain and validation unit tests
```

The most important behaviours protected by M11 are:

* task creation and persistence
* task update results
* missing-record handling
* XP event persistence
* duplicate XP prevention
* gamification summary calculations
* Zustand task reconciliation
* optimistic status-update rollback
* optimistic deletion rollback
* board column rendering
* task grouping by status
* sprint progress
* loading and error feedback
* task-title validation
* gamification summary rendering

Tests focus on observable behaviour rather than private implementation details.

## Baseline Audit

At the beginning of M11, the backend solution built successfully and all existing tests passed.

```text
Backend tests: 69 passed
Backend failures: 0
Backend skipped: 0
```

The existing backend coverage included:

* domain entity construction
* domain validation
* task completion and reopening
* domain-level XP event creation
* domain-level duplicate XP prevention
* achievement rules
* request DTO validation
* EF Core model configuration

The audit identified no service-level test files for:

* `TaskItemService`
* `GamificationService`

The frontend had:

* no Vitest configuration
* no React Testing Library setup
* no jsdom environment
* no Jest-DOM matchers
* no frontend test scripts
* no frontend test files

The frontend production build already passed with 68 modules transformed.

## Backend Testing Tools

The backend test project uses:

* xUnit
* Microsoft.NET.Test.Sdk
* EF Core
* Microsoft.EntityFrameworkCore.Sqlite
* SQLite in-memory databases
* coverlet collector

The backend targets:

```text
.NET 10
```

## Backend Test Categories

### Domain Unit Tests

Domain tests exercise business rules without using a database or ASP.NET Core.

Examples include:

* project creation and validation
* sprint date validation
* task construction
* task status transitions
* task completion timestamps
* task reopening
* XP event construction
* achievement rules
* duplicate XP prevention inside the domain model

These tests are fast and isolated.

### Request Validation Tests

Validation tests exercise the data-annotation rules attached to application request DTOs.

They protect behaviour such as:

* required identifiers
* whitespace-only titles
* invalid enum values
* invalid story-point values
* invalid XP reward values

### EF Core Model Tests

The existing `SprintQuestDbContextTests` verify:

* core entity registration
* required fields
* maximum field lengths
* enum persistence configuration
* important cascade-delete relationships

These tests inspect EF Core model metadata.

### Service Integration-Style Tests

M11 added service tests using the real:

* `TaskItemService`
* `GamificationService`
* `SprintQuestDbContext`
* EF Core SQLite provider
* entity configurations

Each test uses an isolated SQLite in-memory database.

A dedicated helper:

```text
backend/SprintQuest.Tests/Infrastructure/SqliteTestDatabase.cs
```

opens an SQLite connection, creates the schema, exposes a `SprintQuestDbContext`, and disposes the database after the test.

The SQLite connection remains open for the lifetime of each test because an in-memory SQLite database disappears when its connection closes.

These tests are integration-style service tests because they exercise several SprintQuest-owned parts together while remaining isolated from the API and external network.

## TaskItemService Tests

The following file was added:

```text
backend/SprintQuest.Tests/Infrastructure/Services/TaskItemServiceTests.cs
```

The tests protect:

* successful task creation
* persisted task data
* creation with a missing sprint
* authoritative task results after updates
* updating a missing task
* moving a task to `Done`
* persisted XP event creation
* duplicate XP prevention
* successful task deletion
* deletion of a missing task

### Authoritative Update Behaviour

A successful task update returns the authoritative persisted task DTO.

This behaviour is important because the API controller uses that returned task for:

* the REST response
* the SignalR `TaskUpdated` broadcast
* replacement of optimistic Zustand state

The test verifies both the returned DTO and the stored database entity.

### Duplicate XP Prevention

The service tests confirm that:

```text
First valid move to Done
    → one XP event is stored
```

and:

```text
Repeated update while already Done
    → no additional XP event is stored
```

This complements the existing domain-level duplicate-XP test by verifying the database result.

## GamificationService Tests

The following file was added:

```text
backend/SprintQuest.Tests/Infrastructure/Services/GamificationServiceTests.cs
```

The tests protect:

* zero-valued summaries for an empty database
* total XP calculation
* XP event count
* completed-task count
* First Task Complete achievement unlocking
* locked achievements when requirements are not met
* repeated summary requests remaining side-effect free

The repeated-summary test verifies that reading a summary does not create XP events or change task state.

## Frontend Testing Tools

M11 configured:

* Vitest
* React Testing Library
* DOM Testing Library
* `@testing-library/jest-dom`
* jsdom

Vitest is configured through:

```text
frontend/sprintquest-ui/vite.config.ts
```

The test environment is:

```text
jsdom
```

The shared setup file is:

```text
frontend/sprintquest-ui/src/test/setup.ts
```

It enables Jest-DOM matchers and React Testing Library cleanup.

The frontend package scripts include:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

## Frontend Setup Verification

The following test confirms the frontend testing environment works:

```text
frontend/sprintquest-ui/src/test/TestSetup.test.tsx
```

It verifies:

* Vitest test discovery
* TypeScript and JSX transformation
* React component rendering
* jsdom DOM support
* React Testing Library queries
* Jest-DOM matchers

## Zustand Board Store Tests

The following test file was added:

```text
frontend/sprintquest-ui/src/stores/useBoardStore.test.ts
```

The tests use the real Zustand store and mocked task API functions.

They do not:

* render React components
* make real HTTP requests
* connect to SignalR
* use the backend database

### Task Reconciliation

The tests verify that `reconcileTask`:

* adds a task whose ID is missing
* replaces a task whose ID already exists
* does not create duplicate task cards

This protects the interaction between REST responses and SignalR events.

The browser that initiates a change may receive:

* the authoritative REST response
* its own SignalR event

Reconciling by task ID keeps the state idempotent.

### Task Removal

The tests verify that `removeTaskById`:

* removes only the matching task
* leaves other tasks unchanged
* remains safe when the ID is already missing

### Optimistic Status Updates

The tests verify this flow:

```text
User changes status
    ↓
Zustand updates local state immediately
    ↓
API returns the authoritative task
    ↓
Zustand replaces optimistic state
```

They also verify failure behaviour:

```text
Optimistic status update
    ↓
API request fails
    ↓
Previous task collection is restored
    ↓
User-facing error is exposed
```

### Optimistic Deletion

The tests verify:

```text
Delete begins
    ↓
Task is removed immediately
```

After success, the task remains removed.

After failure:

```text
Previous task collection is restored
    ↓
User-facing error is exposed
```

## Sprint Board Component Tests

The following test file was added:

```text
frontend/sprintquest-ui/src/pages/BoardPage.test.tsx
```

The tests render the real `BoardPage` using React Testing Library.

Controlled Zustand state is used, while the SignalR subscription boundary is mocked.

The component tests protect:

* rendering all five board columns
* task counts
* task grouping by status
* sprint progress calculation
* progress-bar value
* completed-task summary
* empty-board guidance
* empty-column feedback
* board loading feedback
* board error feedback
* gamification loading feedback
* gamification error feedback
* total XP display
* achievement count
* unlocked achievement names
* whitespace-only task-title validation
* prevention of invalid task creation

## Accessibility Improvements

M11 added accessible names for:

* every board status column
* the sprint progress bar

Example accessible column names include:

```text
Backlog column
To Do column
In Progress column
Testing column
Done column
```

These changes improve screen-reader navigation and allow tests to use role-based queries rather than relying on CSS classes or internal DOM structure.

## SignalR Testing Decision

M11 does not unit test SignalR’s WebSocket implementation.

Testing SignalR framework internals would provide little value and would introduce unnecessary mocking complexity.

Automated tests instead protect SprintQuest-owned behaviour:

* authoritative task service results
* missing-record service results
* persisted XP behaviour
* Zustand reconciliation
* duplicate prevention
* task removal
* optimistic rollback
* board UI behaviour

M10 manual two-client testing remains the evidence for:

* real WebSocket connections
* cross-client task creation
* cross-client task updates
* cross-client task deletion
* gamification synchronization
* automatic reconnection
* resumed live updates after reconnection

## Running Backend Tests

From the SprintQuest repository root:

```bash
dotnet build backend/SprintQuest.sln
dotnet test backend/SprintQuest.sln
```

To run only the task-service tests:

```bash
dotnet test backend/SprintQuest.Tests/SprintQuest.Tests.csproj \
  --filter FullyQualifiedName~TaskItemServiceTests
```

To run only the gamification-service tests:

```bash
dotnet test backend/SprintQuest.Tests/SprintQuest.Tests.csproj \
  --filter FullyQualifiedName~GamificationServiceTests
```

## Running Frontend Tests

From the frontend project:

```bash
cd frontend/sprintquest-ui
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To run only the Zustand store tests:

```bash
npm test -- src/stores/useBoardStore.test.ts
```

To run only the board component tests:

```bash
npm test -- src/pages/BoardPage.test.tsx
```

To verify the production build:

```bash
npm run build
```

## Final Verification Results

Final M11 verification was completed on 22 July 2026.

### Backend

```text
Backend solution build: passed
Backend tests passed: 79
Backend tests failed: 0
Backend tests skipped: 0
```

### Frontend

```text
Frontend test files passed: 3
Frontend tests passed: 15
Frontend tests failed: 0
Frontend production build: passed
Frontend modules transformed: 68
```

### Git

```text
Branch: test/m11-testing
Working tree: clean
```

## Known Warnings

The Vite production build reports two `INVALID_ANNOTATION` warnings from comments inside:

```text
node_modules/@microsoft/signalr/dist/esm/Utils.js
```

The warnings originate from third-party SignalR package code.

They are considered non-blocking because:

* they are outside SprintQuest-owned source code
* TypeScript compilation succeeds
* the production build completes
* all frontend tests pass

## Known Gaps and Limitations

M11 intentionally does not include:

* Cypress
* Playwright
* browser end-to-end tests
* automated multi-client WebSocket tests
* SignalR framework-internal tests
* visual regression tests
* load testing
* performance testing
* full API-controller integration tests
* deployment-environment tests

SQLite in-memory tests closely match the current local database provider, but behaviour may require additional verification if SprintQuest is deployed with a different database provider.

The frontend component tests use jsdom rather than a full browser, so they do not verify browser layout, CSS appearance, or real WebSocket networking.

These limitations are reasonable for M11 because the milestone focuses on meaningful automated coverage of important existing behaviour.

## Milestone Conclusion

M11 gives SprintQuest reliable automated coverage across both the backend and frontend.

The project now has:

* focused domain unit tests
* request-validation tests
* EF Core model tests
* SQLite service integration-style tests
* Zustand store behaviour tests
* React component tests
* documented test commands
* verified backend and frontend builds

The final result is:

```text
79 backend tests passed
15 frontend tests passed
0 test failures
```

M11 satisfies SprintQuest’s frontend and backend automated testing requirements while preserving the existing architecture and controlled project scope.
