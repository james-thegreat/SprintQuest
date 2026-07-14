# M8 - Zustand State Management

## Goal

The goal of M8 was to implement Zustand as SprintQuest's frontend state management library.

Before this milestone, `BoardPage` managed task data, loading state, API errors, task mutations, XP data, and achievement data using local React state and component functions.

This made the page responsible for both rendering the user interface and coordinating shared application state.

M8 moved the important shared state and asynchronous actions into focused Zustand stores while keeping the visible board behaviour unchanged.

## Advanced requirement

Zustand is one of SprintQuest's top three selected advanced assessment features.

This milestone satisfies the state management library requirement by using Zustand to manage shared frontend state and asynchronous task and gamification operations.

The three selected advanced features are:

1. Zustand state management
2. Security measures
3. SignalR WebSockets

## Why Zustand was selected

Zustand was selected because it provides a small and straightforward state management API for React applications.

It was suitable for SprintQuest because:

- it works well with React and TypeScript,
- it requires less setup than Redux,
- it does not require provider components,
- stores can contain both state and actions,
- components can subscribe only to the state they need,
- asynchronous API operations can be coordinated inside store actions.

Zustand also allowed SprintQuest to introduce shared state without changing the existing backend or API-client architecture.

## Architecture before M8

Before Zustand was introduced, `BoardPage` was responsible for:

- storing the task list,
- loading tasks from the API,
- storing loading state,
- storing error messages,
- creating tasks,
- updating task statuses,
- deleting tasks,
- storing the gamification summary,
- refreshing XP and achievements.

The flow was:

```text
BoardPage
    ↓
API clients
    ↓
ASP.NET Core API