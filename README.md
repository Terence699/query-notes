[中文](./README.zh-CN.md)

# QueryNotes: The Intelligent Note-Taking App

QueryNotes is a modern, high-performance, intelligent note-taking application built with Next.js 15. This project aims to help users easily record, manage, and query their notes.

## Core Feature Roadmap (Phased Development)

We are building a full-featured note-taking application inspired by the simplicity and power of Apple Notes, supercharged with AI. Development is divided into the following phases:

### **Phase 1: Core Functionality & AI Intelligence (COMPLETE ✅)**

**User Authentication:**
* [X] Email/Password Registration & Login (English UI)
* [X] User Session Management
* [X] Public/Private Route Protection
* [X] Unified User Entry Flow
* [X] **Custom Email System**: Professional emails via Resend from `notifications@mail.querynotes.top`
* [X] **Email Webhook Integration**: Seamless Supabase Auth + Resend integration with custom domain

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

**Phase 1 Achievements (COMPLETE ✅):**
* [X] **End-to-End Testing:** Thoroughly test the user flow to ensure all features work as expected and verify app responsiveness.
* [X] **Production Deployment:** Deploy the application to Vercel to mark the official release of Phase 1.
* [X] **Modern Layered UI Design**: Implemented a sophisticated three-layer visual hierarchy with premium styling, subtle gradients, and enhanced interactive elements.
* [X] **Apple-Inspired UI Refinements**: Comprehensive UI optimization based on Apple Chief Designer feedback, including elegant user authentication display, streamlined search interface, refined note cards with hover effects, and cohesive design language.
* [X] **Note Editor Layout Redesign**: Restructured editor layout to prioritize writing flow, relocated AI summary section, and enhanced floating chat button with sophisticated interactions.
* [X] **Complete AI Interface Redesign**: Modern chat interface with improved message bubbles and streamlined action bars.
* [X] **Professional Email System**: Integrated Resend for custom domain emails with webhook architecture.
* [X] **Production-Ready Infrastructure**: Custom domain, SSL, CDN, and professional email delivery system.

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

**User Experience Enhancements:**
* [X] **Dark Mode & Theme Switching**: Complete theme system with light/dark mode toggle, system preference detection, and persistent theme settings across sessions.
* [X] **Dark Mode Rendering Fixes**: Resolved all dark mode rendering issues with comprehensive theme-aware styling, three-layer design pattern support, and proper CSS variable system.
* [X] **Streamlined Navigation**: Redesigned "New Note" button as minimalist purple "+" icon and relocated from header to notes list area for better contextual placement and user experience.

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
*   **Email Service:** [Resend](https://resend.com/) (Custom domain: `mail.querynotes.top`)
*   **AI:** [SiliconFlow](https://siliconflow.cn/) + [DeepSeek API](https://www.deepseek.com/) (with intelligent failover)
*   **AI SDK:** [Vercel AI SDK v3](https://sdk.vercel.ai/)
*   **Deployment:** [Vercel](https://vercel.com/)
*   **DNS & CDN:** [Cloudflare](https://cloudflare.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account
- OpenAI API key (or SiliconFlow/DeepSeek)
- Resend account (for custom emails)
- Custom domain (optional but recommended)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Terence699/query-notes.git
cd query-notes
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration (Choose one or both)
OPENAI_API_KEY=your_openai_api_key
SILICONFLOW_API_KEY=your_siliconflow_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_EMAIL_DOMAIN=mail.yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

### Database Setup

1. **Create a new Supabase project**
2. **Set up the database schema** (tables will be created automatically on first use)
3. **Configure Row Level Security (RLS)** policies
4. **Set up authentication settings**

### Email Integration (Optional)

1. **Set up Resend account** and verify your domain
2. **Configure Supabase email webhook** to use your custom domain
3. **Test email delivery** with the signup flow

## Design Principles

Our goal is to create an application that is not only powerful but also exemplary in its visual and interactive design. We adhere to the following principles:

*   **Design Inspiration:** **Apple Design Language**. We draw inspiration from Apple's Human Interface Guidelines (HIG) to pursue a simple, intuitive, and efficient user experience.
*   **Core Style:** **Elegant & Minimalist**. We believe content is king. The UI should recede, becoming a stage for the content, not a distraction. We achieve this through ample whitespace, clear visual hierarchy, and attention to detail.
*   **Color Strategy:** We use **neutral colors** (black, white, and various shades of gray) as the foundation of the interface, accented with a **single shade of blue** for interactive elements like buttons and links. This ensures visual harmony and focus.
*   **Typography:** We use a clean, legible system font stack (optimized for each platform) to ensure a first-class reading experience on any device with reliable offline performance and instant loading.

## Modern UI Architecture

We've implemented a sophisticated **three-layer visual hierarchy** that creates depth and premium feel throughout the application:

### **Layer Structure:**
*   **Layer 1 (Page Background):** Theme-aware foundation using CSS custom properties (`bg-page`) that adapts to light/dark modes
*   **Layer 2 (Canvas Container):** Adaptive container (`bg-canvas`) with rounded corners and shadows that acts as the content canvas
*   **Layer 3 (Content Cards):** Theme-aware cards with sophisticated gradients (`bg-card-gradient`) that appear to float above the canvas

### **Premium Styling Features:**
*   **Rounded Design Language:** Extensive use of `rounded-2xl` corners for a modern, approachable feel
*   **Subtle Gradients:** Diagonal gradients on note cards create depth without overwhelming the content
*   **Enhanced Shadows:** Layered shadow system (`shadow-md`, `shadow-lg`) that creates natural floating effects
*   **Interactive Elements:** Premium blue-themed buttons and controls with transparency effects for sophisticated interactions
*   **Responsive Grid:** Intelligent spacing with `gap-6` that creates visual channels between content elements

This layered approach ensures excellent visual separation, creates a premium aesthetic, and maintains perfect readability while providing clear interactive feedback to users.

## Apple-Inspired Design Refinements

Following feedback from Apple's Chief Designer, we've implemented comprehensive UI refinements that transform QueryNotes from "a collection of well-designed, separate parts" into "a single, cohesive experience" where every element feels intentional and purposeful.

### **Key Refinements Implemented:**

**Header & Authentication:**
* **Elegant User Dropdown**: Replaced impersonal email display with sophisticated user icon and dropdown menu
* **Professional Navigation**: Improved visual balance and spacing throughout the header
* **Theme Integration**: Seamless light/dark theme support with smooth animations

**Authentication Forms:**
* **Better Positioning**: Moved forms from absolute center to 40% mark for improved grounding
* **Enhanced Contrast**: Improved secondary button styling with primary blue accents
* **Visual Hierarchy**: Forms now feel intentional rather than lost in whitespace

**Note List Interface:**
* **Dissolved Container**: Removed assertive borders to let content be the hero
* **Enhanced Cards**: Implemented subtle hover effects with lift animations (`translateY(-2px)`)
* **Typography Hierarchy**: Strengthened visual weight differences for better content scanning
* **Perfect Alignment**: Aligned all text elements for strong vertical visual order

**Search Experience:**
* **Integrated Search**: Moved search icon inside input field, removed separate button
* **Direct Interaction**: Users can now simply type and press Enter
* **Theme Consistency**: Full theme support with proper color variables

**Note Editor:**
* **Writing-First Layout**: Restructured to prioritize content creation over AI features
* **Relocated AI Summary**: Moved to bottom section for less intrusive experience
* **Enhanced Chat Button**: Sophisticated floating button with gradient and micro-interactions

### **Design Philosophy Achieved:**
* **Interface Recedes**: No more assertive elements drawing attention from content
* **Content is Hero**: Note cards and writing area are now the primary focus
* **Intentional Design**: Every element serves the content, nothing is arbitrary
* **Calm & Confident**: The interface feels open, organized, and purposeful

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

### **Record 8: Preventing Deployment Hell - The Importance of Prop Consistency**

*   **Symptom:** After a series of refactors to improve performance (e.g., hoisting state from `QASidebar` to `QAPanel`), the application would compile locally but repeatedly fail during Vercel's deployment build process with various TypeScript errors (`unused variables`, `type mismatches`, etc.).
*   **Root Cause:** The core issue was a lack of diligent "bookkeeping" after refactoring. When a child component's (`QASidebar`) responsibilities and its required props were changed, the corresponding call to it in the parent component (`QAPanel`) was not always updated in lockstep. This created a discrepancy where the parent tried to pass props that the child no longer accepted, leading to type errors that are strictly enforced by the production build process.
*   **Solution:** A simple but critical process was enforced:
    1.  **Atomic Refactoring:** Treat the modification of a component and its usage as a single, indivisible task.
    2.  **Immediate Verification:** After changing a component's props interface, immediately go to every instance where that component is used and ensure the props being passed match the new definition.
    3.  **Clean Imports:** Always remove unused imports as part of the refactoring process to keep files clean and avoid linter errors during builds.

This disciplined approach ensures that the "contract" between parent and child components is always valid, preventing deployment-blocking type errors and saving significant time and frustration.

---

### **Record 9: Implementing Comprehensive Theme Switching with Hydration-Safe Architecture**

*   **Symptom:** When implementing a dark mode theme switching feature, the application encountered hydration errors with `useTheme must be used within a ThemeProvider` and layout shifts during initial page load.

*   **Root Cause:**
    1.  **Client-Server Boundary Violations:** Theme toggle components were being rendered in server components before the ThemeProvider context was available, causing context access errors.
    2.  **Hydration Mismatches:** Theme state was being applied during server-side rendering without proper hydration handling, causing inconsistencies between server and client rendering.
    3.  **Layout Shifts:** Theme-dependent components rendered with different dimensions before and after hydration, causing visual jumps.

*   **Solution:** A comprehensive theme architecture was implemented with proper hydration handling:
    1.  **CSS Custom Properties Approach:** Instead of relying solely on Tailwind's dark mode classes, implemented a CSS custom properties system that works seamlessly with both light and dark themes, ensuring consistent styling across all components.
    2.  **Hydration-Safe Theme Provider:** Created a ThemeProvider that properly handles server-side rendering by preventing theme application until after component mounting, avoiding hydration mismatches.
    3.  **Client-Only Theme Components:** Developed a `ClientThemeToggle` wrapper component that only renders the actual theme toggle after hydration is complete, with a placeholder to prevent layout shifts.
    4.  **System Preference Detection:** Implemented automatic detection of user's system theme preference with proper fallbacks and localStorage persistence.
    5.  **Comprehensive Component Updates:** Systematically updated all UI components to use theme-aware CSS classes, ensuring consistent appearance across light and dark modes.

*   **Key Technical Decisions:**
    *   Used React Context for theme state management with proper TypeScript typing.
    *   Implemented theme persistence using localStorage with error handling.
    *   Created reusable navigation components that work across different page types.
    *   Ensured accessibility with proper contrast ratios and focus states in both themes.

This implementation provides a professional-grade theme switching experience that respects user preferences, persists across sessions, and maintains visual consistency throughout the application.

---

### **Record 10: Implementing Apple Chief Designer Feedback - From Good to Great**

*   **Symptom:** While the application was functionally complete and visually appealing, feedback from Apple's Chief Designer revealed that it felt like "a collection of well-designed, separate parts" rather than "a single, cohesive experience."

*   **Root Cause:**
    1.  **Assertive UI Elements:** Borders and containers were drawing attention to themselves rather than the content
    2.  **Inconsistent Hierarchy:** Visual weight differences weren't strong enough for optimal content scanning
    3.  **Fragmented Interactions:** UI elements felt disconnected rather than part of a unified system
    4.  **Competing Focus:** AI features were competing with the primary writing experience

*   **Solution:** A comprehensive UI refinement process following Apple's design philosophy:
    1.  **Interface Recession Strategy:** Systematically removed assertive borders and containers, trusting whitespace for organization
    2.  **Content-First Hierarchy:** Restructured layouts to make user content the hero, with AI features supporting rather than competing
    3.  **Micro-interaction System:** Implemented subtle hover effects, lift animations, and smooth transitions to make the interface feel alive
    4.  **Typography Refinement:** Strengthened visual weight differences with proper font weights and opacity levels
    5.  **Cohesive Design Language:** Unified all interactive elements with consistent styling patterns and color usage

*   **Key Technical Implementations:**
    *   **Elegant User Authentication:** Replaced email display with sophisticated dropdown using React state management and click-outside detection
    *   **Streamlined Search:** Integrated search icon inside input field, removing visual clutter while maintaining functionality
    *   **Enhanced Note Cards:** Added `hover:-translate-y-0.5` effects with `transition-all` for smooth, responsive interactions
    *   **Layout Restructuring:** Moved AI summary from top to bottom, prioritizing the writing flow in the note editor
    *   **Font System Optimization:** Replaced Google Fonts with reliable Inter font and system fallbacks for better performance

*   **Result:** The application now embodies Apple's design philosophy where "simplicity is the ultimate sophistication," creating an interface that truly recedes to let content be the hero while providing delightful, purposeful interactions.

---

### **Record 11: Comprehensive Dark Mode Implementation & Navigation Optimization**

*   **Symptom:** Dark mode rendering issues were causing visual inconsistencies, with hardcoded light colors breaking the user experience in dark theme. Additionally, the "New Note" button placement in the navigation header felt disconnected from the actual notes content area.

*   **Root Cause:**
    1.  **Hardcoded Color Dependencies:** Many components used hardcoded Tailwind classes like `bg-slate-50`, `text-gray-600`, and `from-blue-50 to-white` that didn't respond to theme changes
    2.  **Incomplete CSS Variable System:** The existing theme system lacked comprehensive support for complex gradients and three-layer design patterns
    3.  **Poor Contextual Placement:** The "New Note" button in the header wasn't visually associated with the notes list it affected
    4.  **External Font Dependencies:** Google Fonts dependency caused network connectivity issues and deployment problems

*   **Solution:** A systematic approach to theme consistency and user experience optimization:
    1.  **Enhanced CSS Variable System:**
        *   Added comprehensive CSS custom properties for three-layer design (`--color-page-background`, `--color-canvas-background`, `--color-card-gradient-from/to`)
        *   Created utility classes (`bg-page`, `bg-canvas`, `bg-card-gradient`) for consistent theming
        *   Ensured all color variables work seamlessly in both light and dark modes
    2.  **Component-Level Theme Fixes:**
        *   Updated all hardcoded colors in NotesList, SearchBar, Pagination, QASidebar, and loading components
        *   Replaced static gradients with theme-aware alternatives
        *   Fixed loading spinners and skeleton components to use proper theme colors
    3.  **Navigation UX Optimization:**
        *   Redesigned "New Note" button as minimalist purple "+" icon for cleaner aesthetics
        *   Relocated button from navigation header to notes list area for better contextual placement
        *   Positioned button alongside pagination info for immediate visual association with notes content
        *   Added button to empty states for consistent accessibility
    4.  **Font System Optimization:**
        *   Removed Google Fonts dependency to eliminate network connectivity issues
        *   Implemented robust system font stack optimized for each platform
        *   Ensured instant font loading and offline reliability

*   **Key Technical Achievements:**
    *   **Theme Consistency:** All UI elements now properly adapt to light/dark modes with smooth transitions
    *   **Better UX:** "New Note" button placement creates immediate visual connection with notes list
    *   **Performance:** Eliminated external font dependencies for faster loading and better reliability
    *   **Accessibility:** Maintained proper contrast ratios and ARIA labels across all theme states
    *   **Production Ready:** Resolved ESLint compliance issues and deployment blockers

*   **Result:** The application now provides a seamless, professional-grade dark mode experience with optimized navigation patterns that feel intuitive and contextually appropriate, while maintaining excellent performance and reliability.

---

### **Record 12: Implementing Professional Email System with Resend Integration**

*   **Symptom:** Supabase's default email system had severe rate limiting (3 emails per hour), causing user signup failures and poor user experience. The generic Supabase emails also lacked professional branding.

*   **Root Cause:**
    1.  **Rate Limiting:** Supabase's built-in email service is designed for development, not production use
    2.  **Generic Branding:** Default emails came from Supabase domains without custom branding
    3.  **Reliability Issues:** Email delivery was inconsistent and often delayed
    4.  **No Custom Domain:** Emails appeared unprofessional without branded sender addresses

*   **Solution:** Implemented a comprehensive custom email system using Resend with webhook architecture:
    1.  **Custom Domain Setup:**
        *   Configured `mail.querynotes.top` subdomain via Cloudflare DNS
        *   Verified domain ownership with Resend for professional email delivery
        *   Set up proper SPF, DKIM, and DMARC records for email authentication
    2.  **Webhook Architecture:**
        *   Created `/api/auth/send-email` endpoint to handle Supabase auth webhooks
        *   Implemented secure webhook validation using Supabase's hook secrets
        *   Built custom HTML email templates with professional branding
    3.  **Middleware Configuration:**
        *   Updated Next.js middleware to allow API routes as public paths
        *   Fixed authentication redirect issues that were blocking webhook calls
        *   Ensured proper request routing for custom domain integration
    4.  **Production Deployment:**
        *   Configured Supabase auth hooks to use production webhook URL
        *   Set up environment variables for Resend API integration
        *   Tested complete signup flow with real email delivery

*   **Key Technical Implementations:**
    *   **Webhook Security:** Implemented proper secret validation to prevent unauthorized email sending
    *   **Error Handling:** Added comprehensive error handling with detailed logging for debugging
    *   **Email Templates:** Created responsive HTML templates with QueryNotes branding
    *   **Domain Configuration:** Set up proper DNS records and domain verification
    *   **Rate Limit Solution:** Eliminated Supabase's 3-email limit with Resend's generous quotas

*   **Result:** Users now receive professional, branded emails from `notifications@mail.querynotes.top` with reliable delivery, unlimited sending capacity, and a seamless signup experience that enhances the overall application credibility.

---

In the entire process, always refer to the [Next.js official documentation](https://nextjs.org/docs) to ensure the latest Next.js 15 best practices are used.