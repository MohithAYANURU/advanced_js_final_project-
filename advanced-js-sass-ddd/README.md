# University Enrollment System

**Course:** Advanced JavaScript @ EPITA
**Module:** Domain-Driven Design, Branded Types & Observer Pattern

---

## Overview

Build a University Enrollment System from scratch, applying **Domain-Driven Design (DDD)** principles, **TypeScript Branded Types**, and the **Observer Pattern**.

The goal is not just to make the code work — but to model a real domain with proper invariants enforced at both compile-time and runtime.

---

## Learning Objectives

- Implement **Branded Types** from scratch (`type Brand<K, T> = K & { __brand: T }`)
- Apply **Smart Constructors** and the "Parse, Don't Validate" principle
- Design **Value Objects** and **Entities** following DDD
- Build a typed **Observer Pattern** with domain events
- Enforce domain invariants at compile-time and runtime
- Create a working **CLI** demonstrating all enrollment scenarios

---

## Bonus Points: Shared and Collaborative Github Repository

If you have a shared and collaborative repository, you get 2 bonus points. It needs to include regular commits and different branches for each student, or at least 2 pull requests.

## Domain Model

### Entities

| Entity       | Key Properties                                         | Invariants                                                |
| ------------ | ------------------------------------------------------ | --------------------------------------------------------- |
| `Student`    | `id`, `name`, `email`, `enrolledCredits`               | Max 18 credits/semester, valid email, unique ID           |
| `Course`     | `code`, `name`, `credits`, `capacity`, `enrolledCount` | Capacity 1–200, credits in {1,2,3,4,6}, valid code format |
| `Enrollment` | `id`, `studentId`, `courseCode`, `semester`, `status`  | No duplicates, only cancel active enrollments             |

### Value Objects (Branded Types)

| Type           | Format                       | Example          |
| -------------- | ---------------------------- | ---------------- |
| `StudentId`    | `STU` + 6 digits             | `STU123456`      |
| `CourseCode`   | 2–4 letters + 3 digits       | `CS101`          |
| `Email`        | Valid email format           | `alice@epita.fr` |
| `Credits`      | One of: 1, 2, 3, 4, 6        | `3`              |
| `Semester`     | `(Fall\|Spring\|Summer)YYYY` | `Fall2024`       |
| `EnrollmentId` | `ENR` + unique identifier    | `ENR-uuid`       |

---

## Business Rules

1. **Capacity Rule** — Cannot enroll beyond course capacity
2. **Credit Limit Rule** — Student max 18 credits per semester
3. **Branded Types Rule** — All values validated via smart constructors, no `any`
4. **Uniqueness Rule** — No duplicate student + course + semester enrollment

---

## What to Build

- 6 branded types with smart constructors (return `Type | Error`)
- 3 entity classes enforcing all invariants
- Observer pattern (`subscribe`, `unsubscribe`, `emit`)
- Business logic wiring all rules together
- CLI demonstrating 5 scenarios (see below)

---

## CLI Scenarios

| #   | Scenario                    | Expected Outcome                      |
| --- | --------------------------- | ------------------------------------- |
| 1   | Successful enrollment       | `StudentEnrolled` event emitted       |
| 2   | Course reaches 80% capacity | `CourseCapacityReached` event emitted |
| 3   | Course becomes full         | `CourseFull` event emitted            |
| 4   | Student exceeds 18 credits  | Enrollment fails, no event            |
| 5   | Cancel an enrollment        | `EnrollmentCancelled` event emitted   |

---

## Project Structure

```
.
├── index.ts          # CLI entry point
├── src/
│   ├── domain/       # Entities, Value Objects, Business Rules
│   └── infrastructure/ # Observer / EventEmitter implementation
├── docs/
│   └── spec.md       # Full project specification
├── tsconfig.json
└── package.json
```

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Evaluation Criteria

| Criterion                                                            | Weight |
| -------------------------------------------------------------------- | ------ |
| Type Safety (branded types, no `any`, compile-time safety)           | 30%    |
| Domain Design (entities enforce invariants, immutable value objects) | 30%    |
| Observer Pattern (subscribe/unsubscribe works, typed events)         | 20%    |
| Code Quality (clean code, separated concerns)                        | 10%    |
| Working Demo (all 5 CLI scenarios pass)                              | 10%    |

---

## Resources

- [Domain-Driven Design — Martin Fowler](https://martinfowler.com/eaaDev/DomainDrivenDesign.html)
- [Parse, Don't Validate — Alexis King](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
- [TypeScript Handbook — Branded Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Hexagonal Architecture — Martin Fowler](https://martinfowler.com/bliki/HexagonalArchitecture.html)
