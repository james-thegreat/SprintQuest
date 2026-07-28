# SprintQuest — M13 App Selection Foundation

## Overview

M13 creates the shared frontend foundation required by SprintQuest's unfinished application pages.

Before this milestone, the Sprint Board was the only fully connected frontend page. It could load, create, update, and delete tasks, display sprint progress and gamification information, and receive SignalR updates.

However, the application did not have one shared source of truth for:

* available projects
* the selected project
* sprints belonging to the selected project
* the selected sprint
* project and sprint loading states
* API errors
* no-project states
* no-sprint states

The Board also loaded all tasks from the API while task creation used `VITE_DEFAULT_SPRINT_ID`. This meant task reading and task creation did not necessarily use the same sprint context.

M13 introduces a consistent project and sprint selection flow without implementing all unfinished pages.

## Milestone Goals

The goals of M13 are to:

* document project and sprint selection behaviour
* add missing frontend Sprint types
* add missing frontend checklist types
* add typed Sprint and checklist API foundations
* create a shared Zustand application-selection store
* safely load projects
* safely load sprints for the selected project
* persist valid selected project and sprint identifiers
* handle loading, empty, and API-error states
* connect the Sprint Board to the selected sprint
* protect sprint-specific Board state from stale API and SignalR updates
* add focused frontend tests
* document the final architecture and design decisions

## Scope Control

M13 creates shared application foundations only.

M13 does not implement:

* Dashboard data integration
* complete Projects CRUD
* complete Sprint CRUD
* Task Details editing
* checklist screens
* Progress charts
* drag-and-drop
* authentication
* teams or permissions
* comments
* attachments
* notifications
* calendars
* a second state-management approach

Existing backend endpoints must be reused before considering new endpoints.

## Baseline Audit

At the beginning of M13:

```text
Backend tests: 85 passed
Frontend tests: 15 passed across 3 files
Frontend production build: previously passing
Current branch: feature/app-selection-foundation
```

The audit found the following frontend state:

### Connected page

`BoardPage` is connected to:

* `useBoardStore`
* `useGamificationStore`
* the task API
* the gamification API
* the SignalR Board Hub

### Placeholder or incomplete pages

The following pages do not yet use production application data:

* `DashboardPage`
* `ProjectsPage`
* `TaskDetailsPage`
* `ProgressPage`

### Existing API clients

The frontend already contains:

* `apiClient`
* `projectsApi`
* `tasksApi`
* `gamificationApi`

There is no Sprint API client and no checklist API client.

### Existing Zustand stores

The frontend already contains:

* `useBoardStore`
* `useGamificationStore`

There is no shared store for project and sprint selection.

### Existing backend endpoints

The backend already supports the required M13 data flow:

```text
GET /api/Projects
GET /api/Sprints/project/{projectId}
GET /api/TaskItems/sprint/{sprintId}
GET /api/ChecklistItems/task/{taskItemId}
```

No new backend endpoint is expected during M13.

## Architecture Before M13

The current Board task-loading flow is:

```text
BoardPage
    ↓
useBoardStore.loadTasks()
    ↓
GET /api/TaskItems
    ↓
All tasks in the database
```

Task creation uses a different sprint source:

```text
BoardPage
    ↓
VITE_DEFAULT_SPRINT_ID
    ↓
useBoardStore.createTask()
    ↓
POST /api/TaskItems
```

This creates several risks:

* the Board can display tasks from more than one sprint
* progress can be calculated across unrelated sprints
* new tasks can be created in a different sprint from the displayed tasks
* future pages could create their own conflicting selection logic
* a configured environment sprint ID can become stale or invalid

## Architecture After M13

The intended flow is:

```text
Projects API and Sprints API
              ↓
useAppSelectionStore
              ↓
selectedProjectId and selectedSprintId
              ↓
Board and future application pages
```

The store responsibilities remain separated:

```text
useAppSelectionStore
    Application project and sprint context

useBoardStore
    Tasks belonging to the active sprint

useGamificationStore
    XP, achievements, and gamification summary
```

The new selection store must not absorb Board tasks, gamification data, temporary form values, modal state, or future page-specific UI state.

## Frontend Type Foundations

### Project

The frontend Project contract should match the backend `ProjectDto`.

Expected fields:

```text
id
name
description
createdAt
```

`description` can be `null`.

`createdAt` is returned by the API and should not be represented as optional unless the backend contract changes.

### Sprint

A Sprint type is required with:

```text
id
projectId
name
startDate
endDate
createdAt
```

Date values are received from the API as strings.

### Checklist Item

A checklist item type is required with:

```text
id
taskItemId
title
isCompleted
createdAt
completedAt
```

Checklist create and update request types should match their smaller backend request contracts.

M13 adds these foundations but does not create checklist screens.

## API Foundations

M13 should add a Sprint API client with:

```text
getSprintsByProjectId(projectId)
```

The existing backend endpoint should be reused:

```text
GET /api/Sprints/project/{projectId}
```

A checklist API client should represent the existing backend operations:

```text
getChecklistItemsByTaskId
getChecklistItemById
createChecklistItem
updateChecklistItem
deleteChecklistItem
```

Checklist UI behaviour remains deferred to M16.

The existing task API method:

```text
getTasksBySprintId(sprintId)
```

should become the Board's normal read operation.

## Application-Selection Store

The new store should be named:

```text
useAppSelectionStore
```

Its smallest suitable state shape should include:

```text
projects
selectedProjectId
sprints
selectedSprintId
isProjectsLoading
isSprintsLoading
projectsErrorMessage
sprintsErrorMessage
hasInitialised
```

Recommended actions include:

```text
initialise
loadProjects
selectProject
loadSprints
selectSprint
clearSelection
```

The exact TypeScript structure will be added during implementation.

## Derived State

The store should avoid storing duplicate state.

The following values should be derived from IDs and collections:

```text
selectedProject
selectedSprint
hasNoProjects
hasNoSprints
```

For example, the application has a no-project state only when:

```text
project loading has finished
AND there is no project API error
AND the projects collection is empty
```

An API error must not be treated as a successful empty response.

## Initial Project Selection

After projects are loaded:

1. Use the persisted project ID if it still exists in the API response.
2. Otherwise select the first project returned by the API.
3. If no projects exist:

   * clear `selectedProjectId`
   * clear the sprint collection
   * clear `selectedSprintId`
   * expose the no-project state

Persisted identifiers are preferences, not authoritative application data.

## Initial Sprint Selection

After sprints are loaded for the selected project:

1. Use the persisted sprint ID if it belongs to the selected project.
2. Otherwise use `VITE_DEFAULT_SPRINT_ID` only if it matches one of the returned sprints.
3. Otherwise select the first returned sprint.
4. If no sprints exist:

   * clear `selectedSprintId`
   * expose the no-sprint state

`VITE_DEFAULT_SPRINT_ID` is a temporary transition fallback.

It must not remain the permanent source of truth, and `BoardPage` should no longer read it directly after the shared selection flow is connected.

## Changing Projects

When a user selects a different project:

1. update the selected project ID
2. clear the previous project's sprint collection
3. clear the previous selected sprint ID
4. begin loading sprints for the new project
5. select a valid sprint only after the new response succeeds

This prevents the UI from temporarily showing a sprint that belongs to the previous project.

## Persistence Decision

Only these values should be persisted:

```text
selectedProjectId
selectedSprintId
```

The following values should not be persisted:

```text
projects
sprints
loading flags
error messages
hasInitialised
Board tasks
gamification summary
```

Project and sprint collections are API data and must be refreshed.

Loading flags and error messages describe the current browser session.

Persisted IDs must always be checked against fresh API results.

A suitable versioned storage name is:

```text
sprintquest-app-selection
```

## Loading, Empty, and Error States

Project and sprint state must distinguish between:

```text
loading
successful data
successful empty result
API failure
```

### Project states

```text
Loading projects
Projects available
No projects
Projects API error
```

### Sprint states

```text
Waiting for a project
Loading sprints
Sprints available
Selected project has no sprints
Sprints API error
```

Previous API errors should be cleared when a new request begins.

An API error should not cause sample data to be presented as real production data.

## React Strict Mode

The frontend entry point uses React `StrictMode`.

In development, React may run mount effects more than once to expose unsafe side effects.

The selection store's `initialise` action must therefore be idempotent.

Calling it more than once must not:

* produce duplicate project requests unnecessarily
* produce conflicting sprint requests
* overwrite valid state
* create an effect loop
* duplicate persisted values

Application selection should be initialised near the shared application shell rather than independently in every page.

## Stale Request Protection

### Sprint request risk

A user can select Project A and then quickly select Project B.

The Project A sprint request may finish after the Project B request.

A late response for Project A must not replace Project B's current sprint collection.

The store should protect this using either:

* a request sequence identifier, or
* a comparison between the requested project ID and the current selected project ID

The smallest suitable approach should be used.

### Board request risk

The same problem can occur when selected sprints change quickly.

A late task response for an old sprint must not replace tasks for the active sprint.

The Board store should track or validate the sprint associated with the latest task request.

## Board Integration

After M13, the Board loading flow should become:

```text
selectedSprintId
       ↓
useBoardStore.loadTasks(selectedSprintId)
       ↓
GET /api/TaskItems/sprint/{selectedSprintId}
       ↓
Tasks for the selected sprint
```

Task creation should use the same selected sprint ID.

When no sprint is selected, the Board must not:

* load all tasks
* create a task
* silently use an invalid sprint
* display sample data as production data

Instead, it should display a clear no-sprint or selection-loading state.

## Sample Task Decision

The existing Board store uses sample tasks when the task API fails.

This is unsafe after sprint selection because the sample tasks belong to different placeholder sprint IDs and can make a failed API request appear successful.

M13 should stop using sample tasks as API-error fallback data.

On task-loading failure, the Board should expose an error state and avoid presenting sample data as real sprint data.

## SignalR Boundary

The backend currently broadcasts task changes to all connected Board clients.

After the Board becomes sprint-specific, the frontend must not add every incoming task to the visible Board.

An incoming SignalR task should be reconciled only when:

```text
incomingTask.sprintId === activeSprintId
```

A task update that moves or represents another sprint must not pollute the current Board.

SignalR groups are not required during M13. Client-side filtering is sufficient for this milestone.

## Navigation Decision

The current sidebar contains a static link:

```text
/tasks/1
```

Backend task IDs are GUIDs, and Task Details requires a real task identifier.

M13 should:

* remove the static Task Details sidebar item
* keep the `/tasks/:taskId` route
* defer navigation from task cards to M16

Task Details should eventually be opened from a real task card.

## Testing Strategy

M13 should add focused tests before relying on the selection foundation from later pages.

### Application-selection store tests

Create:

```text
src/stores/useAppSelectionStore.test.ts
```

Test:

* successful project loading
* no projects
* project API failure
* valid persisted project selection
* invalid persisted project selection
* successful Sprint loading
* no sprints
* Sprint API failure
* valid persisted Sprint selection
* persisted Sprint belonging to another project
* changing projects clears old Sprint state
* stale Sprint responses are ignored
* only stable identifiers are persisted
* repeated initialisation is safe

### Board store tests

Update:

```text
src/stores/useBoardStore.test.ts
```

Test:

* tasks load using the selected Sprint ID
* `getTasksBySprintId` is called
* API failure does not replace tasks with sample data
* stale task responses are ignored
* incoming SignalR tasks from another Sprint are ignored

### Board page tests

Update:

```text
src/pages/BoardPage.test.tsx
```

Test:

* Board loads tasks for the selected Sprint
* task creation uses the selected Sprint ID
* no selected project state
* no selected Sprint state
* application-selection loading state
* application-selection API error state

### Layout tests

Add focused layout coverage for:

* application selection initialisation
* removal of the static Task Details navigation item
* existing navigation links continuing to render

## Planned Implementation Order

1. Add this M13 design document.
2. Add aligned Project, Sprint, and checklist types.
3. Add Sprint and checklist API clients.
4. Create project-selection state and tests.
5. Add Sprint-selection state and tests.
6. Add persisted selection identifiers.
7. Add stale-request and Strict Mode protection.
8. Initialise selection from the shared application layout.
9. Connect the Board to the selected Sprint.
10. Filter SignalR updates by the active Sprint.
11. Add loading, empty, and API-error behaviour.
12. Run focused tests, the full frontend suite, lint, and production build.
13. Complete M13 documentation and closeout evidence.

## Definition of Done

M13 is complete when:

* project and Sprint selection behaviour is documented
* frontend Sprint types exist
* frontend checklist foundations exist
* required Sprint and checklist API methods exist
* projects can be loaded safely
* sprints can be loaded for the selected project
* selected project state is available through Zustand
* selected Sprint state is available through Zustand
* valid selected identifiers can be persisted
* invalid persisted identifiers are handled safely
* no-project and no-sprint states are represented
* project and Sprint API errors are represented separately
* repeated initialisation is safe under React Strict Mode
* stale API responses cannot overwrite newer selections
* the Board loads tasks for the selected Sprint
* task creation uses the selected Sprint
* SignalR updates cannot pollute another Sprint's Board
* `VITE_DEFAULT_SPRINT_ID` is no longer the Board's permanent source of truth
* the static Task Details sidebar link is removed
* focused frontend tests pass
* the full frontend test suite passes
* lint passes
* the production frontend build succeeds
* M13 documentation is complete
* the feature branch is committed and pushed
* the pull request is merged into `develop`
* M13 GitHub issues are closed
* a handover prompt for M14 is created
