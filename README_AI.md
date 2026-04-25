# ValidPanel Core Frontend - AI Documentation

## Overview

**validpanel** is the **multi-tenant SPA dashboard and platform UI** for the ValidPanel ecosystem. It provides:

1. **Public Pages** - Marketing site (pricing, FAQ, terms)
2. **Onboarding Flow** - User registration → store setup → subscription purchase
3. **Client Dashboard** - Users manage stores, subscriptions, analytics
4. **Admin Dashboard** - Platform admins manage users, subscriptions, payments, coupons

Unlike shop/SMM frontends (Next.js with file-system routing), validpanel is a **React 19 + Vite SPA** with **React Router** for navigation.

## Tech Stack

- **Framework**: React 19 (not Next.js)
- **Build Tool**: Vite (not Next.js build)
- **Router**: React Router 7 (client-side routing)
- **State Management**: React Query (server state) + Context API (app state)
- **UI Components**: shadcn/ui, Tailwind CSS
- **HTTP Client**: Axios (configured in AppContext)
- **Type-Safe**: TypeScript (strict mode)
- **Storage**: IndexedDB (user/admin info), localStorage (user preferences)
- **Notifications**: Sonner (toast library)
- **PDF**: @react-pdf/renderer

## UI Consistency Workflow (Mandatory)

Before implementing any new UI surface or form:

1. Review existing visual language on:
  - `src/client/pages/HomePage.tsx`
  - `src/client/pages/PricingPage.tsx`
2. Check existing reusable components first:
  - `src/components/ui/`
  - `src/client/components/`
3. Reuse platform primitives wherever possible:
  - Use `CustomSelect` for select/dropdown interactions
  - Use `CustomCheckbox` for checkbox/toggle interactions
  - Use `DomainInput` for domain-related data entry
4. Only create a new component when no existing primitive can be reused or safely extended.

## Directory Structure

```
src/
├── App.tsx                      # Main router configuration
├── main.tsx                     # Vite entry point
├── provider/
│   └── queryProvider.tsx        # React Query configuration
├── context/
│   ├── AppContext.tsx           # Global app state (user, admin, api, currency)
│   └── useAppContext.ts         # Hook to use AppContext
├── hooks/                       # React Query + custom hooks
│   ├── use-store.tsx            # Store CRUD operations
│   ├── use-subscription.tsx     # Subscription management
│   ├── use-coupon.tsx           # Coupon validation & admin
│   ├── use-payment.tsx          # Payment operations
│   ├── use-subscription-plan.tsx # Plans + pricing
│   ├── use-admin.tsx            # Admin operations
│   └── use-*.tsx                # (15+ hooks)
├── components/                  # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CurrencySelect.tsx
│   └── ...
├── admin/                       # Admin section
│   ├── pages/                   # Admin pages (20+ pages)
│   │   ├── UsersPage.tsx
│   │   ├── SubscriptionPlansPage.tsx
│   │   ├── CouponsPage.tsx
│   │   ├── PaymentsPage.tsx
│   │   └── ...
│   └── components/              # Admin-specific components
├── client/                      # Client/public section
│   ├── pages/                   # Client pages (20+ pages)
│   │   ├── HomePage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── Step1.tsx - Step6.tsx (onboarding)
│   │   ├── CreateStorePage.tsx
│   │   ├── Stores.tsx
│   │   ├── Subscription.tsx
│   │   ├── UpgradePlan.tsx
│   │   ├── RenewSubscription.tsx
│   │   ├── PaymentStatusPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ...
│   └── components/              # Client-specific components
├── lib/                         # Utilities & helpers
├── types/                       # TypeScript type definitions
├── styles/                      # Global CSS
└── utils/                       # Shared utilities
    ├── normalizeApiErrors.ts    # Error normalization
    └── ...
```

## Core Models

### Store
```typescript
{
  uid: string,
  name: string,
  type: "SHOP" | "SMM",
  status: "ACTIVE" | "INACTIVE",
  plan: SubscriptionPlan | null,
  owner: User,
  domain: string,
  logoUrl?: string,
  color?: string
}
```

### SubscriptionPlan
```typescript
{
  uid: string,
  name: string,
  description: string,
  features: Array<{ label: string, included: boolean }>,
  gracePeriod: number,
  prices: PlanPrice[],
  status: "ACTIVE" | "INACTIVE" | "DRAFT"
}
```

### Subscription
```typescript
{
  uid: string,
  plan: SubscriptionPlan,
  billingCycle: "MONTHLY" | "YEARLY",
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED",
  expiresAt: Date,
  createdAt: Date
}
```

### Coupon
```typescript
{
  uid: string,
  code: string,
  type: "PERCENTAGE" | "FIXED",
  value: string,  // Decimal string
  currency?: string,
  appliesTo: CouponAppliesTo[],  // ["NEW"] | ["RENEWAL"] | ["UPGRADE"]
  contexts: string[],
  isPublic: boolean,
  isActive: boolean
}
```

## Request/Response Pattern

### Frontend Hook Pattern
```typescript
// In component:
const StoreList = () => {
  const { data: stores, isLoading, error } = useGetUserStores();
  
  if (isLoading) return <Loader />;
  if (error) return <ErrorComponent error={error} />;
  
  return <StoreGrid stores={stores} />;
};

// Hook implementation:
export function useGetUserStores() {
  const { api, userInfo } = useAppContext();
  
  return useQuery({
    queryKey: ["stores", userInfo?.uid],  // Cache key includes user
    queryFn: async () => {
      const res = await api.get<{ stores: Store[] }>(`/stores/me`);
      if (!res.data) throw new Error("Failed to fetch stores");
      return res.data.stores;
    },
    enabled: !!userInfo  // Only run if logged in
  });
}
```

### Mutation Pattern (Create/Update/Delete)
```typescript
export function useCreateStore() {
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["createStore"],
    mutationFn: async (newStore: NewStore) => {
      const res = await api.post(`/stores`, newStore);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully");
      // Invalidate cache so list re-fetches
      queryClient.invalidateQueries({
        queryKey: ["stores", userInfo?.uid]
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create store");
      toast.error(errorMsg);
    }
  });
}
```

### Error Normalization
```typescript
// Backend returns:
// { error: "Invalid or inactive coupon" }
// { error: { flatten: { fieldErrors: { code: ["Coupon code required"] } } } }

// Frontend normalizes:
export function normalizeApiError(error: unknown, defaultMsg: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error) {
      if (typeof data.error === "string") return data.error;
      if (data.error.flatten?.fieldErrors) {
        const errors = Object.values(data.error.flatten.fieldErrors);
        return (errors.flat() as string[])[0] || defaultMsg;
      }
    }
  }
  return defaultMsg;
}
```

## Routing Structure

### Route Layout
```
/
├── Public Pages (with layout)
│   ├── /               → HomePage
│   ├── /pricing        → PricingPage
│   ├── /faq            → FAQPage
│   ├── /contact-us     → ContactUs
│   ├── /login          → LoginPage
│   ├── /register       → RegisterPage
│   ├── /terms-of-service
│   ├── /privacy-policy
│   └── /admin/login    → AdminLoginPage

├── Onboarding (no layout)
│   ├── /onboarding/step1 → Step1 (user info)
│   ├── /onboarding/step2 → Step2 (address)
│   ├── /onboarding/step3 → Step3 (store type)
│   ├── /onboarding/step4 → Step4 (store details)
│   ├── /onboarding/step5 → Step5 (plan selection)
│   └── /onboarding/step6 → Step6 (review)

├── Client Dashboard
│   ├── /stores              → StoresPage (list user's stores)
│   ├── /stores/create       → CreateStorePage
│   ├── /subscription        → SubscriptionPage (current plan)
│   ├── /subscription/renew  → RenewSubscription
│   ├── /subscription/upgrade-plan/:id → UpgradePlan
│   ├── /settings            → SettingsPage
│   ├── /analytics           → AnalyticsPage
│   └── /payment-status      → PaymentStatusPage

└── Admin Dashboard (/admin/*)
    ├── /admin/stores              → AdminStoresPage
    ├── /admin/overview            → OverviewPage
    ├── /admin/users               → UsersPage
    ├── /admin/orders              → OrdersPage
    ├── /admin/payments            → PaymentsPage
    ├── /admin/payment-gateways    → PaymentGatewaysPage
    ├── /admin/subscription-plans  → SubscriptionPlansPage
    ├── /admin/coupons             → CouponsPage
    ├── /admin/admin-management    → AdminManagement
    ├── /admin/permissions         → PermissionsPage
    ├── /admin/notifications       → Notifications
    └── /admin/account             → AdminAccountPage
```

## AppContext Pattern

### Initialization
```typescript
const AppProvider = ({ children }: AppProviderProps) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);
  const [userCurrency, setUserCurrencyState] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<CurrencyRates>({});
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // On mount: Load from IndexedDB
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await get<User | null>("userInfo");
        setUserInfo(storedUser || null);
        
        const storedAdmin = await get<Admin | null>("adminInfo");
        setAdminInfo(storedAdmin || null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadUserInfo();
  }, []);
  
  // On change: Save to IndexedDB
  useEffect(() => {
    const saveAuthInfo = async () => {
      await set("userInfo", userInfo);
      await set("adminInfo", adminInfo);
    };
    saveAuthInfo();
  }, [userInfo, adminInfo]);
  
  // Global API instance
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    });
    
    // Add auth token to requests
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    return instance;
  }, []);
  
  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        adminInfo,
        setAdminInfo,
        userCurrency,
        setUserCurrency: setUserCurrencyState,
        rates,
        setRates,
        isAuthLoading,
        api
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
```

### Usage in Hooks
```typescript
export function useGetUserStores() {
  const { api, userInfo } = useAppContext();  // Extract from context
  
  return useQuery({
    queryKey: ["stores", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get(`/stores/me`);  // Use context api
      return res.data.stores;
    },
    enabled: !!userInfo
  });
}
```

## Onboarding Flow (Step1-Step6)

```
Step1: Registration (email, password, name)
  → POST /auth/register
  
Step2: Address Details (country, state, city)
  → Stored in context for later
  
Step3: Store Type Selection (SHOP or SMM)
  → User choice stored
  
Step4: Store Details (name, domain)
  → Store metadata collected
  
Step5: Plan Selection (which subscription plan)
  → Display plans with pricing
  → User selects plan + billing cycle
  
Step6: Review & Confirm
  → Summary of all choices
  → User clicks "Create & Pay"
  → Trigger: useCreateSubscription() + useCreateStore()
  → Redirect to payment gateway
  → On success: /payment-status
```

## Payment Flow

### Regular Subscription
```
1. User at /pricing page
2. Click "Subscribe to Plan A"
3. Modal: Select billing cycle (MONTHLY/YEARLY)
4. useCreateSubscription() hook:
   - POST /subscriptions { planId, billingCycle, currency, redirectUrl }
5. Backend returns: { paymentLink: "paystack.com/pay/..." }
6. Frontend: Redirect to Paystack
7. User pays
8. Paystack redirects to /payment-status?reference=...
9. Frontend polls useGetUserActiveSubscription()
10. When SUCCESS: Show "Subscription active" + redirect to /stores
```

### With Coupon
```
1. At checkout, user enters coupon code
2. useValidateCoupon("SAVE20"):
   - GET /coupons/validate?code=SAVE20
3. Backend returns: { valid: true, discount: ₦5000, finalAmount: ₦45000 }
4. Frontend shows: "Discount applied: ₦5000"
5. useCreateSubscription({ couponCode: "SAVE20" })
   - Backend creates Payment with discounted amount
6. Same payment flow as above
```

### Upgrade/Renew
```
Renewal:
  - /subscription/renew → useRenewSubscription()
  - POST /subscriptions/{id}/renew
  - Redirect to payment

Upgrade:
  - /subscription/upgrade-plan/3 → useUpgradeSubscription()
  - POST /subscriptions/{id}/upgrade { newPlanId: 3 }
  - Shows pro-rated amount
  - Redirect to payment
```

## Hook Categories

### User Subscription Hooks
- `useGetUserStores()` - List user's stores
- `useCreateStore()` - Create new store
- `useUpdateStore()` - Edit store details
- `useDeleteStore()` - Delete store
- `useGetUserCurrentSubscription()` - Get active subscription
- `useGetUserActiveSubscription()` - Get ACTIVE subscription (with polling)
- `useCreateSubscription()` - Initiate payment
- `useUpgradeSubscription()` - Upgrade to higher plan
- `useRenewSubscription()` - Renew expiring subscription

### Coupon Hooks
- `useValidateCoupon()` - Check coupon validity
- `useGetCoupons()` - List coupons (admin)
- `useCreateCoupon()` - Create coupon (admin)
- `useUpdateCoupon()` - Edit coupon (admin)
- `useDeleteCoupon()` - Delete coupon (admin)

### Admin Hooks
- `useGetUsers()` - List all users
- `useGetAdmin()` - Get admin details
- `useGetSubscriptionPlans()` - List all plans
- `useGetPayments()` - List all payments
- `useGetOrders()` - List all orders

## Component Patternsp

### Form with Validation
```typescript
const CreateStoreForm = () => {
  const { mutate, isPending } = useCreateStore();
  const [formData, setFormData] = useState({ name: "", domain: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await mutate(formData);
      // Success handled in hook (toast + redirect)
    } catch (err) {
      const errorMsg = normalizeApiError(err, "Failed to create store");
      setErrors({ submit: errorMsg });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      <button disabled={isPending} type="submit">
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
};
```

### List with Loading/Error States
```typescript
const SubscriptionPlansList = () => {
  const { data: plans, isLoading, error } = useGetSubscriptionPlans();
  
  if (isLoading) return <Skeleton count={3} />;
  if (error) return <ErrorBanner message={normalizeApiError(error)} />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {plans?.map((plan) => (
        <PlanCard key={plan.uid} plan={plan} />
      ))}
    </div>
  );
};
```

## Common Commands

```bash
# Development
npm run dev              # Start Vite dev server with hot reload

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Type Checking
npm run typecheck       # Run TypeScript type checker

# Linting
npm run lint            # Run ESLint
```

## Debugging Tips

1. **React Query DevTools**: Add `<TanstackQueryDevtools />` to see cache
2. **Storage**: Check IndexedDB (DevTools → Application → IndexedDB)
3. **API Calls**: Check Network tab in DevTools
4. **State**: Use React DevTools browser extension
5. **Errors**: Check console for error stack traces

---

**Next**: See [.github/copilot-instructions.md](./.github/copilot-instructions.md) for feature implementation rules and [docs/frontend-guide.md](./docs/frontend-guide.md) for advanced patterns.
