# Security Specification & Test Matrix: OptiMind

## 1. Data Invariants
- Each user profile `/users/{userId}` can only be read and written by the authenticated owner (`request.auth.uid == userId`).
- A user cannot forge their identity (`incoming().userId == request.auth.uid`).
- Subcollections `/users/{userId}/entries/{entryId}` and `/users/{userId}/moods/{moodId}` belong exclusively to `userId` and cannot be read or written by another user.
- Every write must strictly validate field keys, string length bounds, and non-empty IDs (`isValidId()`).
- Path variable hardening prevents path traversal or junk-character injection.

## 2. The Dirty Dozen Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Read**: Attempting to read `/users/user123` without auth.
2. **Unauthenticated Write**: Attempting to write an ABCDE entry without auth.
3. **Cross-User Snooping**: User A attempting to list or get `/users/userB/entries`.
4. **Cross-User Entry Injection**: User A attempting to write to `/users/userB/entries/entry1`.
5. **Identity Spoofing**: User A creating a doc in `/users/userA` with `userId: "userB"`.
6. **Oversized Adversity Attack**: Writing an entry with `adversity` > 2500 characters to exhaust database quotas.
7. **Invalid Category Enumeration**: Writing an entry with `category: "hacker_payload"`.
8. **Invalid Intensity Range**: Writing consequences with intensity = 99 (valid range is 1-10).
9. **Ghost Fields Injection**: Sending unexpected keys in `UserProfile` or `AbcdeEntry`.
10. **ID Poisoning**: Creating an entry where `entryId` contains path traversal characters `../../root`.
11. **Cross-User Mood Check-in Snooping**: User A querying User B's mood history.
12. **Malicious Empty Payload**: Writing `{}` to `/users/{userId}/entries/{entryId}`.
