# Scale Review Template

Use this before implementation in any user-facing flow.

## 1) Concurrency assumptions
- Current expected concurrency:
- Peak expected concurrency:
- Safety target for review: `1 / 10 / 50 / 100` concurrent users

## 2) Frontend impact
- Any `useEffect` / SWR key / Zustand dependency loops possible?
- Calls triggered per user action (target O(1)):
- UI degradation behavior when API latency > 2s:

## 3) Backend/API impact
- Endpoint(s) touched:
- Query count per request (estimate):
- Indexes required / pagination required:
- Idempotency for POST/PUT/DELETE:
- Race-condition risk:

## 4) Verification plan
- Local checks:
- Manual high-load smoke:
- Rollback strategy:
