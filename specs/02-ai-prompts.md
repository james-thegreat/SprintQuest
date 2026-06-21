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