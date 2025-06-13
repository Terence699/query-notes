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
* [ ] **Smart Q&A History**: Add session management to the Q&A panel to save, view, and manage past conversations.

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