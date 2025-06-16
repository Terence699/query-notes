[中文](./README.zh-CN.md)

# QueryNotes: The Intelligent Note-Taking App

QueryNotes is a modern, high-performance, intelligent note-taking application built with Next.js 15. This project aims to help users easily record, manage, and query their notes.

## Core Feature Roadmap (Phased Development)

We are building a full-featured note-taking application inspired by the simplicity and power of Apple Notes, supercharged with AI. Development is divided into the following phases:

### **Phase 1: Core Functionality & AI Intelligence (Current Stage - 95% Complete)**

**User Authentication:**
* [X] Email/Password Registration & Login (English UI)
* [X] User Session Management
* [X] Public/Private Route Protection
* [X] Unified User Entry Flow

**Basic Note Management:**
* [X] Clean & Efficient Note List View
* [X] Create, View, Edit, and Delete Notes
* [X] Basic Text Editor
* [X] Secure Deletion Confirmation

**AI Intelligence (Core Highlight):**
* [X] **Smart Summary**: Generate core summaries of long notes with one click.
* [X] **Smart Q&A**: Ask questions directly to your notes, and the AI will find answers based on the content.
* [X] **Multi-Provider Architecture**: Dual support from SiliconFlow + DeepSeek ensures service stability.
* [X] **Intelligent Failover**: Automatically switches between AI providers for high availability.

**Search & Navigation:**
* [X] **Global Search**: Real-time search for note titles with debounce and loading states.
* [X] **Elegant Interactions**: Apple-style search bar with a clear button and search indicators.
* [X] **Smart Results**: Displays the number of search results and handles empty states.
* [X] **Pagination System**: Responsive pagination (9 notes/page on desktop, 6 on mobile).
* [X] **Smart Pagination**: Search results are automatically paginated and adjust to window resizing.
* [ ] **Content Search**: Currently supports title search only; full-text search will be implemented in Phase 2.

**Tech Stack:**
* [X] Next.js 15 App Router + Server Components
* [X] Supabase Database & Auth
* [X] Vercel AI SDK v3 Integration
* [X] TypeScript Type Safety

**To-Do (Phase 1 Wrap-up):**
* [X] **End-to-End Testing:** Thoroughly test the user flow to ensure all features work as expected and verify app responsiveness.
* [X] **Production Deployment:** Deploy the application to Vercel to mark the official release of Phase 1.
* [ ] **UI/UX Refinement**: Continuously optimize visual design and interaction details.

### **Phase 2: Advanced Features & User Experience (Next Stage)**

**Enhanced Authentication:**
* [ ] Third-Party Login (GitHub, Google)
* [ ] Social Account Linking
* [ ] User Profile Management

**Rich Text Editing Experience:**
* [ ] Integrate a modern rich-text editor (e.g., BlockNote or Tiptap).
* [ ] Markdown support with live preview.
* [ ] Image uploads and embedding.
* [ ] Syntax highlighting for code blocks.
* [ ] Rich formatting like tables, lists, etc.

**Note Organization & Classification:**
* [ ] Folder/Notebook System
* [ ] Tag management and filtering.
* [ ] Enhanced search (full-text, advanced filters).
* [ ] Sorting and view options for notes.
* [ ] Favorites feature.

**Collaboration & Sharing:**
* [ ] Note sharing links.
* [ ] Public/private permission controls.
* [ ] Export functionality (PDF, Markdown).

**AI Feature Upgrades:**
* [X] **Smart Q&A History**: Add session management to the Q&A panel to save, view, and manage past conversations.

### **Phase 3: Advanced AI & Enterprise Features (Future Plans)**

**AI Enhancements:**
* [ ] Smart classification suggestions.
* [ ] Automatic tag generation.
* [ ] Cross-note relationship analysis.
* [ ] Personalized content recommendations.

**Enterprise-Level Features:**
* [ ] Team collaboration spaces.
* [ ] Permission management system.
* [ ] Data backup and synchronization.
* [ ] Public API access.

**Advanced Integrations:**
* [ ] Third-party app integration (Notion, Obsidian import).
* [ ] Browser extensions.
* [ ] Mobile app (React Native).

## Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** [Supabase](https://supabase.io/) (Postgres)
*   **Authentication:** [Supabase Auth](https://supabase.io/docs/guides/auth)
*   **AI:** [SiliconFlow](https://siliconflow.cn/) + [DeepSeek API](https://www.deepseek.com/) (with intelligent failover)
*   **AI SDK:** [Vercel AI SDK v3](https://sdk.vercel.ai/)
*   **Deployment:** [Vercel](https://vercel.com/)

## Design Principles

Our goal is to create an application that is not only powerful but also exemplary in its visual and interactive design. We adhere to the following principles:

*   **Design Inspiration:** **Apple Design Language**. We draw inspiration from Apple's Human Interface Guidelines (HIG) to pursue a simple, intuitive, and efficient user experience.
*   **Core Style:** **Elegant & Minimalist**. We believe content is king. The UI should recede, becoming a stage for the content, not a distraction. We achieve this through ample whitespace, clear visual hierarchy, and attention to detail.
*   **Color Strategy:** We use **neutral colors** (black, white, and various shades of gray) as the foundation of the interface, accented with a **single shade of blue** for interactive elements like buttons and links. This ensures visual harmony and focus.
*   **Typography:** We use a clean, legible sans-serif font (currently Geist) to ensure a first-class reading experience on any device.

## Project Architecture Overview

We are using a modern web architecture based on the Next.js App Router:

*   `src/app/`: Contains all pages, routes, and layouts, fully leveraging file-system routing.
*   `src/components/`: Stores reusable UI components (both client and server).
*   `src/lib/`: Holds utility functions, database queries, and core business logic.
*   `src/actions/`: Contains all Server Actions for securely handling data mutations.
*   `public/`: Stores static assets like images and icons.

## Lessons Learned

In this section, we document key problems encountered during development, our thought processes, and the final solutions. This helps us build knowledge and make better technical decisions in the future.

---

### **Record 1: Solving the Next.js 15 & Supabase Auth Performance Crisis**

*   **Symptom:** User login and registration were extremely slow (over 7 seconds). The Vercel logs showed internal errors related to `_acquireLock`. The dev console repeatedly warned that certain functions `should be awaited...`.
*   **Root Cause:**
    1.  **Resource Contention & Deadlock:** Multiple Supabase client instances were created within the same server request (middleware, server components, Server Actions), conflicting over `cookie` read/write access and causing deadlocks.
    2.  **Failure to Adapt to Next.js 15 Breaking Changes:** Next.js 15 made several core APIs (`cookies()`, `searchParams`) asynchronous. Direct calls without `await` caused runtime errors.
*   **Solution:**
    1.  **Request-Level Client Singleton:** We wrapped the `createClient` function in `src/lib/supabase/server.ts` with React's `cache()` function. This ensures only a single client instance is created per server request, eliminating resource competition.
    2.  **Full Async API Adoption:** We audited all code paths to ensure every call to `createClient`, `cookies()`, and `searchParams` used the `async/await` pattern.
    3.  **Refined Middleware:** We refactored `src/middleware.ts` to clearly distinguish between public and protected paths, reducing unnecessary Supabase client initializations.

---

### **Record 2: Designing a Unified & Intelligent User Entry Flow**

*   **Symptom:** Initially, logged-in users were redirected directly to `/notes`, bypassing the homepage and creating an inconsistent experience. The main "Get started" button was static.
*   **Root Cause:**
    1.  **Fragmented User Flows:** Separate flows for logged-in and logged-out users created complexity and inconsistency.
    2.  **Unclear Component Responsibility:** The global layout and page components both tried to handle navigation, leading to duplicate UI elements.
*   **Solution:**
    1.  **Unified Entry Point:** We eliminated the automatic redirect, establishing the homepage (`/`) as the single entry point for all users.
    2.  **Centralized Layout:** We simplified the global layout and moved all navigation UI into page-level components for modularity.
    3.  **Implemented Smart Navigation:** On the homepage server component, we fetch the user's login status and use it to dynamically set the `href` of the "Get started" button (`/notes` for logged-in users, `/signup` for guests).

---

### **Record 3: Implementing Type-Safe & Interactive Deletion**

*   **Symptom:** The codebase had "implicit `any` type" linter warnings. The note deletion process was not user-friendly and lacked a confirmation step.
*   **Root Cause:**
    1.  **Missing Type Definitions:** Callbacks in `.map()` functions lacked explicit type definitions for their parameters.
    2.  **Server-Side-Only Thinking:** A simple Server Action for a destructive operation like deletion couldn't provide the necessary interactive warning.
*   **Solution:**
    1.  **Added Explicit Types:** We added clear interface types to the function parameters, resolving the linter warnings.
    2.  **Created a Client-Side Interaction Component (`DeleteNoteButton.tsx`):** We created a `'use client'` component to use the browser's `window.confirm` API.
    3.  **Bound the Server Action:** We used the `.bind(null, noteId)` method to pre-bind the `deleteNote` Server Action with the specific `noteId`. This allowed us to use the action directly in the client-side `<form>`.
    4.  **Combined with `onSubmit` for Safe Confirmation:** We used the form's `onSubmit` event to trigger `window.confirm`. If the user cancels, `e.preventDefault()` stops the form submission and the Server Action from being called.

---

### **Record 4: Conquering the Client-Server Boundary with Server Actions and API Routes**

*   **Symptom:** After refactoring AI chat logic to Server Actions, the Next.js application continuously failed to build with an `Ecmascript file had an error` specifically referencing `import 'server-only'` within our `src/actions/chat.ts` and `src/lib/supabase/server.ts` files.
    The error message explicitly stated: `You're importing a component that needs "server-only". That only works in a Server Component which is not supported in the pages/ directory.` This occurred despite the chat functionality seemingly being implemented correctly on the server side.

*   **Root Cause:**
    1.  **Misleading Error Message:** The `server-only` error was a symptom, not the core problem. The underlying issue was client-side components (`QAPanel.tsx`, `QASidebar.tsx`) directly importing and attempting to use server-only code (Server Actions like `continueConversation`, `getQASessions`, `getQAMessages`). Next.js's build process correctly identified this violation of the client-server boundary.
    2.  **Type Inconsistencies (Initial Attempts):** Earlier attempts to fix the problem by addressing TypeScript type errors within `continueConversation` (e.g., `UserContent` not being a string, or `stream.toDataStream()` not existing on all return paths) were correct but insufficient, as the fundamental architectural violation remained.

*   **Solution:**
    1.  **Adopted API Routes as a Bridge:** The definitive solution involved reintroducing API routes (`src/app/api/chat/route.ts`, `src/app/api/sessions/route.ts`, `src/app/api/messages/route.ts`) to act as a crucial bridge between client-side components and server-side logic.
    2.  **Client-Side Component Refactoring:**
        *   `QAPanel.tsx`: Modified `useChat` hook to make HTTP `POST` requests to `/api/chat` instead of directly invoking the `continueConversation` Server Action.
        *   `QASidebar.tsx`: Modified `useEffect` and `handleSessionClick` to use standard `fetch()` calls to `/api/sessions?noteId=...` and `/api/messages?sessionId=...` respectively, replacing direct Server Action imports.
    3.  **Preserved Server Action Integrity:** The Server Actions themselves (`continueConversation`, `getQASessions`, `getQAMessages` in `src/actions/chat.ts`) remained as server-only functions, focusing purely on secure data handling and AI logic, now correctly invoked only by API routes.
    4.  **Ensured Robust Error Handling:** Within `continueConversation`, a clear `throw new Error()` pattern was established for unrecoverable AI service failures, allowing the client-side `useChat` hook to gracefully catch and display these errors.

This architectural pattern ensures that client components only communicate with the server via well-defined HTTP endpoints (API routes), which then orchestrate calls to server-only logic (Server Actions), respecting Next.js's client-server boundary and leveraging its full power.

---

### **Record 5: Navigating `useChat` State Management for Historical Conversations**

*   **Symptom:** When a user selected an existing chat session from the history sidebar, the main chat panel would appear empty, despite the `onSelectSession` callback correctly providing the historical messages.

*   **Root Cause:** The Vercel AI SDK's `useChat` hook, upon detecting a change in its `id` prop (which we set to `sessionId`), internally interpreted this as the start of a *new* conversation and automatically reset its internal message state. Our subsequent `setMessages` call was then overwritten or ignored due to this internal reset mechanism.

*   **Solution:** To prevent the `useChat` hook from prematurely clearing the messages, an intermediate state (`initialSession`) was introduced in `QAPanel.tsx`.
    1.  When `handleSelectSession` is called from `QASidebar`, it now stores the `newSessionId` and `newMessages` into `initialSession` instead of directly setting `sessionId` and `messages`.
    2.  A `useEffect` hook was added to `QAPanel.tsx` to watch for changes in `initialSession`. When `initialSession` is populated, this `useEffect` then safely updates `sessionId` and `messages` *after* `useChat` has had a chance to complete its internal reset based on the new `sessionId`.
    3.  This two-step process ensures that the historical messages are correctly loaded into the chat panel without being overwritten by `useChat`'s internal logic.

---

### **Record 6: Eliminating Sluggish UI with Proactive Caching & State Hoisting**

*   **Symptom:** The user experience for the AI chat history was sluggish and disjointed.
    1.  **Initial list loading was slow:** Clicking the "History" button for the first time resulted in a noticeable delay before the session list appeared. Subsequent clicks were fast.
    2.  **Session loading was jarring:** Clicking a specific session in the history list caused the main chat panel to go blank for a moment before the messages suddenly appeared, creating a jarring and confusing experience.

*   **Root Cause:**
    1.  **On-Demand Fetching:** The session list was only fetched from the database *after* the user clicked the history button, causing the initial delay. The subsequent speed was due to the browser's native HTTP caching, which is not a reliable application-level strategy.
    2.  **Decoupled & Unmanaged Loading States:** The loading state for fetching an individual session's messages was managed locally within the `QASidebar` component. The parent `QAPanel` was unaware of this loading process. It would receive the messages after the fact and update its state, causing the abrupt UI change without a proper loading indicator.

*   **Solution:** A two-pronged approach was implemented to make the UI feel instantaneous and responsive.
    1.  **Proactive Caching Strategy:** The responsibility for fetching the session list was moved to the parent `QAPanel`. It now **pre-fetches** the list as soon as the panel is opened and **caches** the result in its state. When the user clicks the "History" button, `QASidebar` receives the cached data as a prop and renders it instantly. The cache is intelligently invalidated (cleared) only when a new chat is initiated, ensuring the list is refreshed when necessary.
    2.  **State Hoisting & Centralized Loading UI:** The logic for fetching individual session messages was "hoisted" (lifted up) from `QASidebar` to `QAPanel`.
        *   `QAPanel` now manages a global `isHistoryLoading` state.
        *   When a session is clicked, `QAPanel` immediately sets this state to `true`, displaying a **prominent, centered loading spinner** in the main chat view.
        *   `QASidebar` was refactored into a purely presentational component, simply displaying the loading state passed down from its parent.
        *   This ensures the user gets immediate visual feedback the moment they interact with the UI, bridging the perceived gap during data fetching.

This refactoring centralized data fetching logic in the parent component, enabling intelligent caching and a clear, responsive loading experience that feels significantly faster and more professional to the user.

---

### **Record 7: Further Optimizing Initial Data Loading Performance**

*   **Symptom:** Despite significant UI responsiveness improvements, the *initial* loading time for the chat history list (when the QA panel is first opened after a page refresh) and the *initial* loading time for a specific chat history record into the QA panel remain noticeable.

*   **Root Cause:** While front-end caching and state hoisting drastically improved *subsequent* interactions (making them near-instantaneous), the very first data fetch for any given note still requires direct communication with the Supabase database. Without proper database optimization, these initial queries can be slow, leading to a perceived sluggishness even with loading indicators.

*   **Solution & Future Optimization:** The primary solution to reduce these raw initial loading times is to implement **database indexing**.
    *   **Action:** Add indexes to the `qa_sessions` table, specifically on the `note_id` and `user_id` columns. These are the columns most frequently used in queries for fetching chat sessions and their associated messages.
    *   **Benefit:** Database indexes dramatically speed up data retrieval operations by allowing the database to quickly locate requested data without scanning entire tables. This will directly reduce the time it takes for Supabase to return the initial session list and individual chat messages, making the very first load feel much faster.

---

In the entire process, always refer to the [Next.js official documentation](https://nextjs.org/docs) to ensure the latest Next.js 15 best practices are used. 