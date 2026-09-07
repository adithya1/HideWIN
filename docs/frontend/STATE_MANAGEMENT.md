# CLIENT STATE MANAGEMENT ARCHITECTURE

## Overview
The frontend applications (`apps/desktop` and `apps/web`) implement a strict architectural boundary between **Server State** (data fetched from the API) and **Client State** (ephemeral UI state like toggles, active tabs, and modals).

## 1. Server State (Data Fetching & Caching)
- **Tooling**: We utilize TanStack Query (React Query) or SWR to manage all server state.
- **Why**: Traditional Redux is an anti-pattern for API data. React Query provides automatic caching, background fetching, stale-while-revalidate, and deduplication out of the box.
- **Optimistic Updates**: When a user mutates data (e.g., updating a meeting title), the UI updates instantly. If the API returns a 5xx error, React Query rolls back the UI state to the previous cached value automatically.

## 2. Client State (Local UI)
- **Tooling**: Zustand (or React Context for simple features).
- **Why**: Zustand provides a lightweight, boilerplate-free global store without the heavy middleware requirements of Redux.
- **Scope**: Used exclusively for UI states (e.g., `isSidebarOpen`, `activeMicrophoneDeviceId`).

## 3. Realtime State (WebSockets)
- **Integration**: WebRTC signaling and live AI transcription chunks are received via WebSockets.
- **Pattern**: Incoming socket events dispatch updates directly to the relevant Zustand store or invalidate specific React Query caches, instantly re-rendering the UI without requiring a full page refresh.

## 4. Persistent Storage Sync
- **Local Storage**: Non-sensitive client state (like UI themes or selected camera device) is synchronized to `localStorage` (Web) or `electron-store` (Desktop).
- **Security**: Authentication JWTs and encryption keys are NEVER stored in generic `localStorage`. They reside in HttpOnly cookies or the OS Secure Enclave (via Electron keytar/safeStorage).

## 5. Resilience
- **Error Boundaries**: React Error Boundaries wrap major routing components. If a sub-component crashes due to malformed state, the boundary catches it, logs to our observability platform, and displays a graceful fallback UI instead of a white screen of death.
- **Loading States**: All async boundaries utilize React `Suspense` and Skeleton loaders to prevent layout shift.
