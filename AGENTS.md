# Project Architecture

- Keep daily activity selection in `activityRotation.ts`; this makes yearly coverage independently testable and prevents hidden activities.
- Keep all age-range content controls in the single administrator configuration page; this prevents scattered, inconsistent access settings.
