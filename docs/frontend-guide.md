# ValidPanel Frontend Development Guide

## Complete Application Flow

### User Journey: Registration → Subscription → Store

```
1. User visits / (HomePage)
   ↓ see pricing, click "Get Started"

2. Redirect to /register
   → useRegisterUser() hook
   → POST /auth/register { email, password, name }
   → Backend returns: { user: {...}, jwt: "..." }
   → Frontend: localStorage.setItem("jwt", token)
   → Frontend: setUserInfo(user) to AppContext
   ↓

3. Redirect to /onboarding/step1 (User Details)
   → Form: First name, last name, phone
   → useState stores temp data
   ↓

4. /onboarding/step2 (Address)
   → Form: Country, state, city
   ↓

5. /onboarding/step3 (Store Type)
   → Radio: Select "SHOP" or "SMM"
   ↓

6. /onboarding/step4 (Store Details)
   → Form: Store name, domain
   ↓

7. /onboarding/step5 (Plan Selection)
   → useGetSubscriptionPlans() fetches all ACTIVE plans
   → Display: 3 pricing cards
   → User selects plan + billing cycle (MONTHLY/YEARLY)
   ↓

8. /onboarding/step6 (Review)
   → Summary of all selections
   → User clicks "Create & Subscribe"
   → Triggers: useCreateStore() + useCreateSubscription()
   ↓

9. Payment Gateway
   → useCreateSubscription() returns: { paymentLink: "..." }
   → Frontend redirects to Paystack
   → User enters card details
   → Payment processed
   → Paystack redirects to /payment-status?reference=...
   ↓

10. /payment-status
    → useGetUserActiveSubscription() polls for subscription ACTIVE
    → Shows: "Payment processing..." or "Subscription activated!"
    → On success: Redirect to /stores
    ↓

11. /stores (Dashboard)
    → useGetUserStores() fetches user's stores
    → Display: List of stores with plan info
    → User can create more stores
```

## Hook Categories & Patterns

### User Subscription Management

**useGetUserStores()**
```typescript
- Query: GET /stores/me
- Filters: Only authenticated user's stores
- Usage: List page, dashboard
- Cache key: ["stores", userInfo?.uid]

const { data: stores, isLoading, error } = useGetUserStores();
```

**useCreateStore()**
```typescript
- Mutation: POST /stores
- Input: { name, description, type, domain, subscriptionId }
- Invalidates: ["stores", userInfo?.uid]
- Usage: Create store form

const { mutate, isPending } = useCreateStore();
mutate({ name: "My Shop", type: "SHOP", ... });
```

**useGetUserActiveSubscription()**
```typescript
- Query: GET /subscriptions/active
- Special: Polls continuously for status change
- Usage: Subscribe button, payment status page
- Cache key: ["active-subscription", userInfo?.uid]

const { data: subscription } = useGetUserActiveSubscription();
// Subscription exists when status: "ACTIVE" and not expired
```

**useCreateSubscription()**
```typescript
- Mutation: POST /subscriptions
- Input: { planId, billingCycle, currency, couponCode?, ... }
- Output: { status: "pending", paymentLink: "https://paystack.com/..." }
- Usage: Checkout flow, initiate payment

const { mutate, isPending } = useCreateSubscription();
const handleCheckout = () => {
  mutate({ planId: 5, billingCycle: "MONTHLY", currency: "NGN" });
  //onSuccess: redirect to mutation.data.paymentLink
};
```

**useUpgradeSubscription()**
```typescript
- Mutation: POST /subscriptions/{id}/upgrade
- Input: { newPlanId }
- Calculates: Pro-rated amount
- Usage: Upgrade plan page

const { mutate } = useUpgradeSubscription();
mutate({ newPlanId: 7 });
```

**useRenewSubscription()**
```typescript
- Mutation: POST /subscriptions/{id}/renew
- Usage: Renew expiring subscription
- Same payment flow as new subscription

const { mutate } = useRenewSubscription();
mutate({ /* no input */ });
```

### Billing & Pricing

**useGetSubscriptionPlans()**
```typescript
- Query: GET /subscription-plans (PUBLIC)
- Filters: Only ACTIVE plans
- Includes: prices[{ interval, currency, price, ... }]
- Usage: Pricing page, plan selection

const { data: plans } = useGetSubscriptionPlans();
plans.forEach(plan => {
  plan.prices.forEach(price => {
    // Display: price.interval + price.currency + price.price
  });
});
```

**useValidateCoupon()**
```typescript
- Mutation: POST /coupons/validate
- Input: { code: "SAVE20" }
- Output: { valid: true, discount: 5000, finalAmount: 45000 }
- Usage: Apply coupon before checkout

const { mutate, data: couponResult } = useValidateCoupon();
mutate({ code: "SAVE20" });
if (couponResult?.valid) {
  setFinalPrice(couponResult.finalAmount);
}
```

### Coupon Management (Admin)

**useGetCoupons()**
```typescript
- Query: GET /coupons/admin (ADMIN ONLY)
- Cache key: ["coupons"]

const { data: coupons } = useGetCoupons();
```

**useCreateCoupon()**
```typescript
- Mutation: POST /coupons
- Input: {
    code: "SAVE20",
    type: "PERCENTAGE",
    value: "20",
    maxUses: 100,
    perUserLimit: 2,
    appliesTo: ["NEW", "RENEWAL"],
    isPublic: true,
    ...
  }
- Invalidates: ["coupons"]

const { mutate } = useCreateCoupon();
```

**useUpdateCoupon()**
```typescript
- Mutation: PUT /coupons/{uid}
- Input: Coupon fields to update
- Invalidates: ["coupons", uid]

const { mutate } = useUpdateCoupon();
mutate({ uid: "coupon_123", isActive: false });
```

### Admin Operations

**useGetUsers()** (ADMIN)
```typescript
- Query: GET /admin/users
- Cache key: ["users"]
```

**useGetPayments()** (ADMIN)
```typescript
- Query: GET /admin/payments
- Cache key: ["payments"]
```

## Component Patterns

### PricingPage Component

```typescript
const PricingPage = () => {
  const navigate = useNavigate();
  const { userInfo, userCurrency } = useAppContext();
  const { data: plans, isLoading } = useGetSubscriptionPlans();

  if (isLoading) return <SkeletonGrid count={3} />;

  return (
    <div className="pricing-page">
      <h1>Choose Your Plan</h1>
      <div className="grid">
        {plans?.map(plan => (
          <PlanCard
            key={plan.uid}
            plan={plan}
            onSelect={() => {
              if (userInfo) {
                navigate("subscription/checkout", { 
                  state: { planId: plan.id } 
                });
              } else {
                navigate("/register");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

const PlanCard = ({ plan, onSelect }: Props) => {
  const { userCurrency } = useAppContext();
  const price = plan.prices.find(p => p.currency === userCurrency);

  return (
    <div className="card">
      <h3>{plan.name}</h3>
      <p className="price">
        {price?.price} {price?.currency} / {price?.interval}
      </p>
      <ul>
        {plan.features?.map(f => (
          <li key={f.label}>
            {f.included ? "✓" : "✗"} {f.label}
          </li>
        ))}
      </ul>
      <button onClick={onSelect}>Select Plan</button>
    </div>
  );
};
```

### Checkout Page (Coupon + Payment)

```typescript
const CheckoutPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const { userInfo, userCurrency } = useAppContext();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);

  const { mutate: validateCoupon, isPending: validatingCoupon } = useValidateCoupon();
  const { mutate: createSubscription, isPending: creatingSubscription } = useCreateSubscription();

  const handleApplyCoupon = () => {
    validateCoupon(
      { code: couponCode },
      {
        onSuccess: (data) => {
          setCouponResult(data);
          toast.success(`Coupon applied! Save ${data.discount}`);
        },
        onError: (error) => {
          const msg = normalizeApiError(error, "Invalid coupon");
          toast.error(msg);
        }
      }
    );
  };

  const handleCheckout = () => {
    createSubscription(
      {
        planId: parseInt(planId),
        billingCycle,
        currency: userCurrency,
        couponCode: couponResult?.code,
        redirectUrl: `${window.location.origin}/payment-status`
      },
      {
        onSuccess: (data) => {
          window.location.href = data.paymentLink;  // Redirect to Paystack
        }
      }
    );
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      {/* Billing Cycle Selection */}
      <div>
        <label>Billing Cycle:</label>
        <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as any)}>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      {/* Coupon Section */}
      <div className="coupon-section">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={validatingCoupon || !couponCode}
        >
          Validate
        </button>
        {couponResult && (
          <p className="success">
            Coupon valid! Discount: {couponResult.discount} {userCurrency}
          </p>
        )}
      </div>

      {/* Price Summary */}
      <div className="summary">
        <div>Base Price: {couponResult?.originalAmount} {userCurrency}</div>
        {couponResult?.discount > 0 && (
          <div className="discount">- {couponResult.discount} {userCurrency}</div>
        )}
        <div className="final">
          <strong>Final: {couponResult?.finalAmount} {userCurrency}</strong>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={creatingSubscription}
      >
        {creatingSubscription ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};
```

### Payment Status Page

```typescript
const PaymentStatusPage = () => {
  const { userCurrency } = useAppContext();
  const { data: subscription, isLoading } = useGetUserActiveSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (subscription?.status === "ACTIVE") {
      toast.success("Subscription activated!");
      setTimeout(() => navigate("/stores"), 1500);
    }
  }, [subscription?.status]);

  if (isLoading) return <Loader />;

  if (subscription?.status === "ACTIVE") {
    return (
      <div className="success">
        <h1>✓ Payment Successful</h1>
        <p>Your subscription has been activated</p>
        <p>Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</p>
        <Link to="/stores">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="pending">
      <h1>Processing Payment...</h1>
      <Spinner />
      <p>Please wait while we confirm your payment</p>
      <p>This page will auto-refresh</p>
    </div>
  );
};
```

## Error Handling Patterns

### Normalized Error Display

```typescript
import { normalizeApiError } from "@/utils/normalizeApiErrors";

// In component
try {
  const result = await subscription.mutate(data);
} catch (err) {
  const message = normalizeApiError(err, "Subscription failed");
  toast.error(message);
  setError(message);
}

// Supported backend errors:
// { error: "Invalid coupon" } → "Invalid coupon"
// { error: { flatten: { fieldErrors: { code: ["Required"] } } } } → "Required"
// Network error → Default message
```

## Advanced Patterns

### Polling for Status Changes

```typescript
// useGetUserActiveSubscription already implements polling:
export function useGetUserActiveSubscription() {
  return useQuery({
    queryKey: ["active-subscription", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get("/subscriptions/active");
      return res.data;
    },
    refetchInterval: 3000,  // Poll every 3 seconds
    refetchOnWindowFocus: true,  // Re-poll on tab focus
  });
}
```

### Currency Conversion

```typescript
const PlanPriceDisplay = ({ price }: { price: PlanPrice }) => {
  const { userCurrency } = useAppContext();

  const displayPrice = price.currency === userCurrency
    ? price.price
    : convertCurrency(price.price, price.currency, userCurrency);

  return <span>{displayPrice} {userCurrency}</span>;
};
```

## Type Safety

### TypeScript Interfaces

```typescript
// types/models/subscription.ts
export interface Subscription {
  uid: string;
  plan: SubscriptionPlan;
  billingCycle: "MONTHLY" | "YEARLY";
  status: "PENDING" | "ACTIVE" | "EXPIRED";
  expiresAt: Date;
  createdAt: Date;
}

// Use in components
const { data: subscription } = useGetUserActiveSubscription();
// subscription is properly typed!
```

---

**Reference**: See [README_AI.md](./README_AI.md) for overview and [.github/copilot-instructions.md](./.github/copilot-instructions.md) for rules.
