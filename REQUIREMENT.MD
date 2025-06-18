# zigvy-interview-homework

# 📝 Project Brief
Build `ZigTask`, a simple task-management app with both a web client and a mobile client, backed by a Nest.js API and a database (your choice of PostgreSQL or MongoDB). Users can:

1. Sign up / Sign in (email & password).
2. Create, edit, delete tasks (title, description, due date, status).
3. View task list grouped by status (“To Do”, “In Progress”, “Done”).
4. Toggle task status with immediate UI feedback (optimistic update).
5. Search & filter tasks by title or date range.

# 🎯 Requirements

1. Backend (Nest.js)
    - Auth: JWT-based sign-up & sign-in endpoints.
    - CRUD API for tasks, with proper validation (e.g. class-validator).
    - Database: Model tasks & users. Use TypeORM (PostgreSQL) or Mongoose (Mongo).
    - API Documentation: Swagger or OpenAPI spec.

2. Web Frontend (React.js + TS) - `Choose either Web, Mobile, or both—depending on your preference and expertise.`
    - Auth flow: Pages/flows for sign-up, sign-in, sign-out.
    - Dashboard: List tasks grouped by status. Implement drag-and-drop between columns (e.g. react-beautiful-dnd).
    - Task Form: Modal or page to create/edit a task.
    - Search & Filter: Real-time title search + date-picker filter.
    - State management: Your choice (Context, Redux Toolkit, Zustand, etc.).
    - UI/UX: Clean, responsive layout. Use a component library (e.g. Ant Design, Chakra, or Tailwind + headless UI).

3. Mobile Client (React Native + TS) - `Choose either Web, Mobile, or both—depending on your preference and expertise.`
    - Auth: Reuse API; store JWT securely (e.g. AsyncStorage + context).
    - List view: FlatList of tasks; swipe actions to change status or delete.
    - Task Form: Native form for create/edit.
    - Offline support: Cache last-fetched task list and show when offline; sync changes when back online.

4. Extra Credit **(pick at least one)**
    - Real-time updates via WebSockets (e.g. broadcast status changes).
    - Push notifications for tasks due within the next hour.
    - Dark mode toggle for web and mobile.
    - Unit & e2e tests: Jest for backend, React Testing Library for web, Detox or similar for mobile.
    - CI/CD: A simple GitHub Actions pipeline that lints, tests, and builds.

# 📂 Deliverables

1. Code Folders Repo: `zigtask-api`, `zigtask-client`.

2. README:
    - Project overview
    - Setup & run instructions (backend, web, mobile)
    - Decisions & trade-offs you made
    - Swagger/OpenAPI spec (or link to /docs)
    - Screenshots (or short video) of web & mobile in action

# 🧪 Evaluation Criteria

| Area | What We’re Looking For |
|------|------------------------|
| Correctness |	All core flows work; data persists correctly. |
| Code Quality | Clear structure, modularity, TypeScript typings. |
| Productivity |	Real-world tooling (linters, prettier, scripts). |
| UI/UX |	Usable, responsive, accessible interfaces. |
| State Management |	Clean data binding; minimal “boilerplate.” |
| Documentation |	Easy to follow setup; notes on design decisions. |
| Testing & CI |	Bonus for solid test coverage & automation. |
| Creativity |	Extra features, thoughtful edge-case handling. |

# ⏰ Timeline & Submission
  - Target: Complete within 8–12 hours.
  - Deadline: As specified in your invitation email.

```
### Submission Process: IMPORTANT!!! — GUIDELINES MUST BE FOLLOWED
1. Fork the provided GitHub repository.
2. Create a new branch from your fork named ${yourname}_${month_year}, e.g: `nguyenvana_june2025`.
3. Complete the tasks, making frequent commits (we want to see your workflow).
4. Push your branch and create a Pull Request against the original repository.
5. Send the PR link to us via email to notify us of your submission.
```

---
# ✅ What This Assignment Actually Assesses
---
1. End-to-end architecture sense
    - Choose sensible folder structures and separation of concerns.
    - Wire up auth, data models, and client–server contracts.

2. TypeScript fluency & code quality
    - Types must be used effectively (not just any).
    - Code reads clearly, with well-named functions and minimal duplication.

3. UI/UX judgment
    - The interface is responsive and accessible.
    - Handle edge cases (empty lists, loading/error states)?

4. State management & data binding
    - An approach that fits app complexity (Context API vs Redux Toolkit vs Zustand)?
    - Optimistic updates implemented cleanly?

5. Database modeling & validation
    - The schema normalized (for SQL) or sensibly embedded (for Mongo)?
    - Incoming payloads validated (class-validator, Joi, etc.)?

6. Dev-ops & productivity habits
    - Presence of linting/prettier, helpful NPM scripts.
    - Clear README with setup instructions and rationale for trade-offs.

7. Extra credit innovation
    - Tackling WebSockets, offline sync, dark mode, or CI pipelines shows willingness to go beyond the bare minimum.

# 🎯 How to Grade & Differentiate Candidates
1. Commit history & incremental progress
    - Look for small, logical commits. A single huge “initial submission” commit is a red flag.

2. Design rationale
    - Explain the choices in the README? Good candidates will justify why they chose one library or pattern over another.

3. Code maintainability
    - Are there comments only where needed? Is the code DRY (Don’t Repeat Yourself)?

4. Error handling & edge cases
    - Robust candidates anticipate and handle failures (network errors, invalid input).

5. Test coverage (if attempted)
    - Even a few unit tests for critical functions indicate an understanding of quality practices.

# 🛡️ Mitigating AI-Generated “Cheating”
1. Require a short design doc or architecture diagram
    - Candidates will be asked to sketch their data models, API routes, and component hierarchy before during the face-to-face interview. AI can generate code, but bespoke diagrams and annotated trade-off discussions are required.

2. Enforce staged commits
    - The more frequent and meaningful your commits are, the more they demonstrate your coding ability and prove that the code was genuinely written by you—not generated by AI.

# 🔑 Bottom Line
A take-home test is a starting point. Its real power comes from:

1. What you (candidates) submit (code quality, docs, tests),
2. How do you defend the work in a follow-up, and
3. Your grading rubric rewards thoughtful trade-offs over copy-pasted solutions.

# 🚀💻🎉 HAPPY CODING 👨‍💻✨💡
