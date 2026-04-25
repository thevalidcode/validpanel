# ValidPanel Core Frontend - Copilot Instructions

**Service**: Multi-tenant SPA dashboard & onboarding  
**Tech Stack**: React 19, Vite, React Router, React Query, TypeScript  
**Scope**: Public pages, onboarding, client dashboard, admin dashboard

## Key Differences from shop/SMM Frontends

This is a **React SPA (Vite)**, NOT Next.js like shop/SMM frontends.

### Storage: IndexedDB + localStorage
```typescript
// ✅ CORRECT: Use AppContext for user/admin (persisted to IndexedDB)
const { userInfo, setUserInfo, adminInfo, setAdminInfo } = useAppContext();

// ✅ CORRECT: Use localStorage for UI preferences
localStorage.setItem("userCurrency", "NGN");
```

## Critical Rules for validpanel

### 0. UI Consistency Workflow (Mandatory)
- Before creating or changing UI, review existing patterns on home and pricing pages:
	- `src/client/pages/HomePage.tsx`
	- `src/client/pages/PricingPage.tsx`
- Before creating new controls, scan component libraries first:
	- `src/components/ui/`
	- `src/client/components/`
- Reuse existing primitives when available:
	- `CustomSelect` instead of native `<select>`
	- `CustomCheckbox` instead of native checkbox UIs
	- `DomainInput` for domain/subdomain entry flows
- Do not introduce ad-hoc controls if an existing component can be expanded safely.

### 1. Multi-Tenancy Scoping (User-Level)
```typescript
// ✅ CORRECT: Fetch only authenticated user's data
const { data: stores } = useGetUserStores();  // Hook adds user.id implicitly

// ❌ WRONG: Fetching stores without user context
const stores = await api.get("/stores");  // Could get other users' stores!
```

### 2. React Query Cache Keys Must Include User Scope
```typescript
// ✅ CORRECT: Includes userInfo.uid
queryKey: ["stores", userInfo?.uid]  // Cache per user

// ❌ WRONG: Global cache key
queryKey: ["stores"]  // Could leak data
```

### 3. Hook Implementation Checklist
- [ ] Extract `{ api, userInfo }` from AppContext
- [ ] Use React Query with scoped cache keys
- [ ] Include error handling with toast
- [ ] Include onSuccess cache invalidation
- [ ] Quote mutations with mutationKey

### 4. Never Hardcode API URLs
```typescript
// ✅ CORRECT
const res = await api.get("/stores");  // api from AppContext

// ❌ WRONG
const res = await axios.get("http://localhost:3001/stores");
```

### 5. AppContext Handles JWT Automatically
```typescript
// ✅ CORRECT: JWT added automatically
const res = await api.get("/stores");

// ❌ WRONG: Manual header management
const headers = { Authorization: `Bearer ${token}` };
const res = await api.get("/stores", { headers });
```

## Routing Structure

- Public: `/`, `/pricing`, `/login`, `/register`, `/terms-of-service`
- Onboarding: `/onboarding/step1` through `/onboarding/step6`
- Client: `/stores`, `/subscription`, `/settings`, `/analytics`
- Admin: `/admin/*` (UsersPage, SubscriptionPlansPage, CouponsPage, PaymentsPage, etc.)

## Local Development

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production build
npm run typecheck  # Type checking
```

---

See [README_AI.md](../README_AI.md) for full architecture.
