# Security Specification for KeralaConnect

## 1. Data Invariants
- A `Vehicle` must always have a `driverId` matching the user who created it.
- A `Vehicle` cannot be updated by anyone other than the driver who is currently tracking.
- `User` profiles and `UserSavedRoute` documents are private and only accessible by the owner.
- `Vehicle` data is public for reading to allow all users to track transit.

## 2. The "Dirty Dozen" Payloads
1. **Identity Theft (Vehicles):** Attempt to create a vehicle with a `driverId` that doesn't match the authenticated user.
2. **Unauthorized Update (Vehicles):** User A attempts to update a vehicle document owned by User B.
3. **Ghost Field Injection:** Attempt to inject a field `isAdmin: true` into a `Vehicle` document.
4. **ID Poisoning:** Attempt to create a vehicle with a document ID that is 1MB of junk characters.
5. **PII Leak:** Attempt to read another user's profile document.
6. **Self-Promotion:** Attempt to update your own user profile to include a `role: 'admin'` field if not allowed.
7. **Resource Exhaustion:** Attempt to send a `routeName` that is 10MB in size.
8. **Stale Data Injection:** Attempt to write a `lastUpdated` timestamp from the client that is 1 year in the past.
9. **Invalid Enum Value:** Attempt to set `crowdLevel` to `overloaded` (not in enum).
10. **Orphaned Route:** Attempt to save a route for a different user's ID path.
11. **Type Mismatch:** Sending a string for `lat` instead of a number.
12. **Status Skipping:** (N/A for this app as status is simple, but we can guard terminal states if needed).

## 3. Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
|------------|-------------------|-------------------|--------------------|
| vehicles   | Prevented (driverId check) | N/A | Prevented (size checks) |
| users      | Prevented (userId check) | N/A | Prevented (size checks) |
| savedRoutes| Prevented (userId check) | N/A | Prevented (size checks) |
