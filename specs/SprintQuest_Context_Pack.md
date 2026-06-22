# SprintQuest / MSA Phase 2 Context Pack

**Use this file at the start of every new ChatGPT thread for this project.**  
Upload it or paste the relevant sections so the assistant has the project context, assessment requirements, architecture, Git workflow, learning preferences, and milestone plan.

---

## 1. Who I am and how I want to learn

My name is **James Dunlop**. I am building this as part of the **Microsoft Student Accelerator 2026 Phase 2 Software Stream** assessment.

I want this project to be a learning project as well as a submission project.

### Teaching style I want

Please follow these rules when helping me:

- Do **not** give me the whole project at once.
- Work in **small milestones** and **small coding steps**.
- Explain **why** before **what**.
- After each coding step, explain:
  - what changed,
  - why we did it,
  - where it fits architecturally,
  - how to test it,
  - when to commit it.
- Teach me like I am preparing for a real junior developer role.
- Use Git workflow guidance throughout, not only at the end.
- Use GitHub Projects, milestones, issues, user stories, and pull requests.
- Help me understand the code, not just copy it.
- If there is an error, debug it step by step with me.
- Keep the scope controlled so I can actually finish and submit.

### My current skill context

I have already been learning and building projects using:

- C#
- ASP.NET Core Web API
- Clean Architecture-style project structure
- Entity Framework Core
- SQLite
- React + Vite
- SignalR
- REST APIs
- DTOs
- Controllers
- Dependency Injection
- xUnit tests
- Git and GitHub
- GitHub Issues and project planning
- Swagger/OpenAPI-style API testing

I have worked on projects such as:

- Barber Booking System
- Real-Time Chat app using SignalR
- Text RPG with C# domain logic, API, React UI, and tests

So for this project, please build on those concepts and connect new ideas back to things I already know.

---

## 2. Assessment context

This project is for **MSA 2026 Phase 2 | Software Stream**.

### Required theme

The required theme is **Gamification**.

Gamification means adding game design elements to a non-game application. Examples include:

- points,
- XP,
- badges,
- achievements,
- streaks,
- leaderboards,
- progress tracking,
- levels,
- rewards.

The project does **not** have to be a game. It can be a useful app with game-like motivation features.

### Basic assessment requirements

The application must include both a frontend and a backend.

#### Frontend requirements

- Built with **React**.
- **TypeScript is preferred**.
- Visually appealing and responsive UI.
- Navigation using React Router or similar.
- Clear Git usage with regular commit history.
- Deployed frontend.
- Frontend unit tests covering key components/functionality.

#### Backend requirements

- Built using **C# with .NET 10 or higher**.
- Must use **Entity Framework Core**.
- Must use database persistence with SQL or NoSQL.
- Must implement CRUD operations.
- Clear Git usage with regular commit history.
- Backend unit tests covering key backend components/functionality.
- Deployed backend.
- Must expose **Scalar API documentation UI instead of Swagger UI**.

### Advanced requirements

At least **three advanced requirements** must be implemented and explicitly listed in the README.  
Only the top three advanced features listed in the README will be marked.

Chosen top three advanced features for this project:

1. **State management library**: Zustand
2. **Security measures**: at least two, such as password hashing, data validation/sanitisation, rate limiting, or RBAC
3. **WebSockets**: SignalR live board updates

Optional extra if time allows:

- Theme switching with light/dark mode
- Docker
- Cypress end-to-end tests
- Caching/API optimisation

### Required repository content

The repo should contain:

- frontend code,
- backend code,
- README,
- `/specs` folder,
- deployment links,
- video link for submission.

The README should include:

- deployment link,
- project introduction,
- how the project relates to gamification,
- interesting/unique features,
- clear checklist of top 3 advanced features,
- self-reflection,
- setup instructions,
- testing instructions.

The `/specs` folder should contain `.md` files with evidence of:

- planning,
- design,
- AI-assisted development,
- AI prompts used during development,
- agent instructions,
- context/config files.

The submission video must be **maximum 6 minutes** and should include:

- how AI was used during development,
- design decisions made during the project.

---

## 3. Project concept

## Working title: SprintQuest

SprintQuest is a **gamified project development canvas board**.

It is similar to a small Trello/Jira-style board, but designed for students or developers managing software projects through sprints, tasks, checklists, and milestones.

The app helps users plan project work and stay motivated by awarding XP, achievements, streaks, and sprint progress.

### Core idea

Users can create:

- projects,
- sprints,
- task cards,
- checklist items,
- statuses/columns,
- priorities,
- story points,
- progress ticks.

Gamification features include:

- XP rewards when tasks are completed,
- XP rewards when checklist items are ticked,
- sprint progress bars,
- achievements/badges,
- project level,
- streaks,
- “sprint complete” bonus.

### Example board columns

- Backlog
- To Do
- In Progress
- Testing
- Done

### Example task card fields

- title,
- description,
- status,
- priority,
- story points,
- XP reward,
- due date,
- checklist progress,
- created date,
- completed date.

### Example achievements

- **First Task Complete**: Complete your first task.
- **Sprint Finisher**: Complete all tasks in a sprint.
- **Bug Slayer**: Complete 5 bug tasks.
- **Momentum Builder**: Complete tasks 3 days in a row.
- **Clean Board**: Move all sprint tasks to Done.
- **Deep Work**: Complete a high story-point task.

### How the project fits the gamification theme

SprintQuest applies gamification to project planning. Instead of being a game, it uses game-like elements such as XP, achievements, progress bars, streaks, and completion rewards to make project development feel more motivating and engaging.

---

## 4. Recommended architecture

Use a Clean Architecture-style backend similar to my previous projects.

```text
SprintQuest/
│
├── backend/
│   ├── SprintQuest.Api
│   ├── SprintQuest.Application
│   ├── SprintQuest.Domain
│   ├── SprintQuest.Infrastructure
│   └── SprintQuest.Tests
│
├── frontend/
│   └── sprintquest-ui
│
├── specs/
│   ├── 01-project-plan.md
│   ├── 02-ai-prompts.md
│   ├── 03-architecture.md
│   ├── 04-design-decisions.md
│   ├── 05-advanced-features.md
│   └── 06-testing-plan.md
│
├── README.md
└── .gitignore
```

### Backend layer responsibilities

#### SprintQuest.Domain

Contains the core business models and rules.

Examples:

- Project
- Sprint
- TaskItem
- ChecklistItem
- Achievement
- XpEvent
- TaskStatus enum
- Priority enum

Business rules that belong here:

- completing a task sets `CompletedAt`,
- completing a task awards XP,
- checklist progress affects task progress,
- sprint completion can trigger bonus XP,
- achievement logic can be tested separately.

The Domain layer should not depend on EF Core, controllers, or React.

#### SprintQuest.Application

Contains application logic, DTOs, interfaces, and use cases.

Examples:

- DTOs for create/update/read operations,
- service interfaces,
- application services,
- validation rules,
- request/response models.

This layer coordinates actions but should not directly know about the database implementation.

#### SprintQuest.Infrastructure

Contains database and external implementation details.

Examples:

- EF Core DbContext,
- repositories,
- database migrations,
- entity configuration,
- seed data.

Infrastructure depends on Domain/Application, not the other way around.

#### SprintQuest.Api

Contains the ASP.NET Core Web API.

Examples:

- Controllers,
- SignalR hubs,
- auth setup,
- Scalar API documentation,
- dependency injection wiring,
- middleware,
- API endpoints.

Controllers should stay thin. They should call services rather than containing all business logic.

#### SprintQuest.Tests

Contains unit tests for:

- domain rules,
- application services,
- key backend behavior.

### Frontend structure

Use React + TypeScript + Vite.

Recommended structure:

```text
frontend/sprintquest-ui/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── features/
│   │   ├── projects/
│   │   ├── sprints/
│   │   ├── board/
│   │   ├── tasks/
│   │   ├── gamification/
│   │   └── auth/
│   ├── pages/
│   ├── routes/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   └── tests/
```

Use Zustand for shared frontend state such as:

- selected project,
- selected sprint,
- board state,
- task filters,
- theme state,
- progress summary.

---

## 5. Git workflow

Use Git flow style.

### Main branches

```text
main
develop
```

- `main` is only for stable, release-ready versions.
- `develop` is the integration branch where completed feature branches are merged.

### Supporting branches

```text
feature/*
bugfix/*
hotfix/*
release/*
docs/*
test/*
```

Use examples like:

```text
feature/backend-solution-setup
feature/domain-models
feature/efcore-database
feature/crud-api-scalar
feature/frontend-setup
feature/sprint-board-ui
feature/gamification-system
feature/zustand-state-management
feature/security-measures
feature/signalr-live-board

bugfix/task-status-update
hotfix/deployment-env-error
release/v1.0.0-msa-submission
docs/readme-skeleton
docs/specs-folder
test/backend-domain-tests
```

### Normal workflow

```text
main
  ↓
develop
  ↓
feature/something
  ↓
Pull Request into develop
  ↓
develop
  ↓
release/v1.0.0
  ↓
main
```

### Typical commands

Start from develop:

```bash
git checkout develop
git pull
git checkout -b feature/example-name
```

After work:

```bash
git status
git add .
git commit -m "feat: add example feature"
git push -u origin feature/example-name
```

Then open a Pull Request:

```text
feature/example-name → develop
```

Use this in PR descriptions to close issues:

```text
Closes #ISSUE_NUMBER
```

### Commit message style

Use simple conventional commits:

```text
feat: add project entity
fix: correct task status update
docs: add architecture notes
test: add task completion tests
chore: create backend solution
refactor: move XP logic into domain
```

---

## 6. GitHub Projects workflow

Use GitHub Projects to track the work.

### Project board name

```text
SprintQuest MSA Phase 2
```

### Board statuses

```text
Backlog
Ready
In Progress
Review
Done
```

### Suggested fields

```text
Priority: High / Medium / Low
Type: Feature / Bug / Docs / Test / Chore
Area: Backend / Frontend / Domain / API / Infrastructure / Specs
Milestone: M0, M1, M2...
Story Points: 1, 2, 3, 5, 8
```

### GitHub milestones

```text
M0 - Planning & Repository Setup
M1 - Backend Solution Setup
M2 - Core Domain Models
M3 - EF Core Database
M4 - CRUD API & Scalar Docs
M5 - Frontend Setup
M6 - Sprint Board UI
M7 - Gamification System
M8 - Zustand State Management
M9 - Security Measures
M10 - SignalR Live Board
M11 - Testing
M12 - Deployment
M13 - README, Specs & Video
M14 - Final Release
```

### User story template

Use this for GitHub issues:

```markdown
## User Story

As a [type of user],
I want [some feature],
so that [benefit/value].

## Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Suggested Subtasks

- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

## Notes

Any design decisions, AI prompts, or important context.
```

---

## 7. Milestone plan

### M0 - Planning & Repository Setup

Goal: define the project before coding.

Create:

- README skeleton,
- `/specs` folder,
- project plan,
- architecture plan,
- AI prompts file,
- GitHub Project board,
- GitHub milestones,
- first issues/user stories,
- `main` and `develop` branches.

Suggested branches:

```text
docs/project-plan
docs/architecture-plan
docs/readme-skeleton
docs/specs-folder
docs/git-flow-setup
```

Definition of Done:

- repo exists,
- README skeleton exists,
- `/specs` folder exists,
- GitHub Project exists,
- M0 issues exist,
- `develop` branch exists,
- first PR merged into `develop`.

---

### M1 - Backend Solution Setup

Goal: create the .NET backend solution structure.

Create:

- SprintQuest.Api
- SprintQuest.Application
- SprintQuest.Domain
- SprintQuest.Infrastructure
- SprintQuest.Tests

Learn:

- project references,
- why Domain is separate,
- how API connects to Application/Infrastructure,
- where tests belong.

Branch:

```text
feature/backend-solution-setup
```

Definition of Done:

- solution builds,
- references are correct,
- first basic test runs,
- branch merged into develop.

---

### M2 - Core Domain Models

Goal: create the core business models.

Create:

- Project,
- Sprint,
- TaskItem,
- ChecklistItem,
- Achievement,
- XpEvent,
- TaskStatus enum,
- Priority enum.

Learn:

- entities vs DTOs,
- business rules,
- domain methods,
- unit testing domain behavior.

Branch:

```text
feature/domain-models
```

Definition of Done:

- domain models exist,
- basic rules implemented,
- tests for key domain behavior pass,
- branch merged into develop.

---

### M3 - EF Core Database

Goal: persist data using EF Core.

Create:

- DbContext,
- DbSets,
- EF Core packages,
- database migration,
- SQLite/PostgreSQL setup,
- entity relationships.

Branch:

```text
feature/efcore-database
```

Definition of Done:

- migration works,
- database created,
- data persists,
- branch merged into develop.

---

### M4 - CRUD API & Scalar Docs

Goal: expose backend CRUD APIs.

Create:

- DTOs,
- controllers,
- services,
- validation,
- Scalar API docs.

Endpoints should cover:

- Projects CRUD,
- Sprints CRUD,
- Tasks CRUD,
- Checklist Items CRUD.

Branch:

```text
feature/crud-api-scalar
```

Definition of Done:

- CRUD works,
- Scalar API docs work,
- manual endpoint testing complete,
- branch merged into develop.

---

### M5 - Frontend Setup

Goal: create the React TypeScript frontend.

Create:

- Vite React TypeScript app,
- React Router,
- page structure,
- API service structure,
- basic responsive layout.

Pages:

- Dashboard,
- Project page,
- Sprint board page,
- Task details page,
- Profile/progress page.

Branch:

```text
feature/frontend-setup
```

Definition of Done:

- frontend runs,
- routing works,
- basic pages exist,
- branch merged into develop.

---

### M6 - Sprint Board UI

Goal: build the canvas board.

Create:

- board columns,
- task cards,
- status updates,
- create/update/delete tasks from frontend,
- API integration.

Branch:

```text
feature/sprint-board-ui
```

Definition of Done:

- board displays tasks,
- task status can change,
- frontend calls backend,
- branch merged into develop.

---

### M7 - Gamification System

Goal: strongly connect the project to the gamification theme.

Create:

- XP rewards,
- achievement unlocks,
- sprint progress,
- project/user level,
- gamification UI.

Branch:

```text
feature/gamification-system
```

Definition of Done:

- completing tasks awards XP,
- achievements unlock,
- progress is visible,
- tests cover key gamification rules,
- branch merged into develop.

---

### M8 - Zustand State Management

Goal: implement advanced feature 1.

Use Zustand for:

- selected project,
- selected sprint,
- board state,
- filters,
- progress summary.

Branch:

```text
feature/zustand-state-management
```

Definition of Done:

- Zustand installed,
- stores created,
- state moved out of messy component state,
- README advanced feature checklist updated,
- branch merged into develop.

---

### M9 - Security Measures

Goal: implement advanced feature 2.

Implement at least two:

- password hashing,
- data validation/sanitisation,
- rate limiting,
- RBAC/authorisation.

Branch:

```text
feature/security-measures
```

Definition of Done:

- at least two security measures implemented,
- README explains why they matter,
- tests added where appropriate,
- branch merged into develop.

---

### M10 - SignalR Live Board

Goal: implement advanced feature 3.

Create:

- BoardHub,
- live task moved event,
- live task completed event,
- live achievement unlocked event,
- frontend SignalR connection.

Branch:

```text
feature/signalr-live-board
```

Definition of Done:

- SignalR hub works,
- frontend receives board updates,
- README explains WebSockets feature,
- branch merged into develop.

---

### M11 - Testing

Goal: satisfy frontend and backend testing requirements.

Backend:

- xUnit,
- domain tests,
- service tests.

Frontend:

- Vitest,
- React Testing Library,
- key component tests.

Branch:

```text
test/unit-tests
```

Definition of Done:

- backend tests pass,
- frontend tests pass,
- README has test instructions,
- branch merged into develop.

---

### M12 - Deployment

Goal: deploy frontend and backend.

Deploy:

- frontend,
- backend,
- database if needed.

Update:

- README deployment links,
- environment variable notes,
- CORS config if needed.

Branch:

```text
release/deployment-prep
```

Definition of Done:

- deployed frontend works,
- deployed backend works,
- frontend can call backend,
- deployment links are in README,
- branch merged into develop.

---

### M13 - README, Specs & Video

Goal: prepare submission materials.

Finish:

- README,
- `/specs`,
- AI prompt evidence,
- design decision notes,
- advanced feature checklist,
- self-reflection,
- 6-minute video script.

Branch:

```text
docs/submission-polish
```

Definition of Done:

- README complete,
- specs complete,
- video script complete,
- branch merged into develop.

---

### M14 - Final Release

Goal: final release and submission check.

Branch:

```text
release/v1.0.0-msa-submission
```

Checklist:

- frontend deployed,
- backend deployed,
- database working,
- README complete,
- `/specs` complete,
- video public,
- GitHub repo public,
- no secrets committed,
- tests pass,
- no commits after deadline.

Final merge path:

```text
develop → release/v1.0.0-msa-submission → main
```

---

## 8. Standard milestone starter prompt

Use this at the start of each new ChatGPT thread.

```text
I am working on my MSA 2026 Phase 2 Software Stream project called SprintQuest.

I have uploaded my SprintQuest Context Pack. Please read it and continue using that context.

Current milestone:
[WRITE MILESTONE NUMBER AND NAME HERE]

Current Git branch:
[WRITE BRANCH NAME HERE]

Current goal:
[WRITE WHAT I AM TRYING TO COMPLETE HERE]

Important teaching rules:
- Do not give me the whole project at once.
- Work step by step.
- Explain why before what.
- Include Git workflow guidance.
- Help me create GitHub user stories/issues for the milestone.
- After each coding step, explain what changed, why it matters, where it fits architecturally, how to test it, and when to commit.
- At the end of the milestone, create a handoff prompt for the next thread.
```

---

## 9. Standard milestone closeout checklist

At the end of every milestone, check:

```markdown
## Milestone Closeout

- [ ] All user stories are completed
- [ ] Acceptance criteria are checked
- [ ] Tests pass
- [ ] App still runs
- [ ] README/specs updated if needed
- [ ] Branch committed
- [ ] Branch pushed
- [ ] Pull request opened
- [ ] Pull request merged into develop
- [ ] GitHub issues closed
- [ ] End-of-milestone prompt created
```

---

## 10. Standard end-of-milestone handoff prompt

Use this to start the next thread.

```text
I have completed [MILESTONE NUMBER AND NAME] for SprintQuest.

Completed:
- [LIST WHAT WAS COMPLETED]
- [LIST TESTS OR CHECKS DONE]
- [LIST BRANCH MERGED INTO DEVELOP]

Current repo state:
- main branch is stable
- develop branch includes completed milestone work
- latest completed branch: [BRANCH NAME]

Please start [NEXT MILESTONE NUMBER AND NAME] with me.

Follow my project rules:
- Explain why before what
- Work step by step
- Create GitHub user stories/issues first
- Include Git workflow guidance
- Do not give me the whole project at once
- Teach me the architecture as we go
```

---

## 11. Scope control rules

To keep the project finishable:

- Do not build a full Jira clone.
- Do not start with drag-and-drop unless the core board works first.
- Do not start with real-time multiplayer until CRUD and board UI work.
- Do not add Docker unless the required work is stable.
- Do not leave README/specs until the last day.
- Commit regularly.
- Test small pieces as they are built.
- Keep the top 3 advanced features clear in the README.

---

## 12. Current recommended next step

Start with:

```text
M0 - Planning & Repository Setup
```

First tasks:

1. Create GitHub repo.
2. Create GitHub Project board.
3. Create GitHub milestones.
4. Create M0 issues/user stories.
5. Create README skeleton.
6. Create `/specs` folder.
7. Create `develop` branch.
8. Make first docs PR into `develop`.

