# University Enrollment System - Project Specification

- Project Overview - Context and learning objectives
- Domain Model - Entities, Value Objects, and their responsibilities
- Business Rules - Invariants they must enforce
- Branded Types Requirements - What types to create and why
- Observer Pattern Requirements - Events and subscription mechanism
- What's Provided - Boilerplate they'll receive
- What to Build - Their implementation tasks
- CLI Scenarios - Concrete examples to demonstrate
- Evaluation Criteria - How you'll assess their work

## 1. Project Overview

Students will build a University Enrollment System demonstrating DDD principles, TypeScript Branded Types, and the Observer Pattern.

### Learning Objectives:

- Implement Branded Types from scratch
- Apply Smart Constructors and "Parse, Don't Validate"
- Design Value Objects and Entities following DDD
- Build Observer Pattern with typed events
- Enforce domain invariants at compile-time and runtime
- Create working CLI demonstrating enrollment scenarios

## 2. Domain Model

- 2.1 Core Entities

### Student (Entity)

- Properties: id (StudentId), name (string), email (Email), enrolledCredits (Credits)
- Invariants: Max 18 credits per semester, valid email, unique ID

### Course (Entity)

- Properties: code (CourseCode), name (string), credits (Credits), capacity (number), enrolledCount (number)
- Invariants: Capacity 1-200, credits must be 1/2/3/4/6, can't exceed capacity, valid course code format

### Enrollment (Entity)

- Properties: id (EnrollmentId), studentId, courseCode, semester (Semester), status (active|cancelled)
- Invariants: No duplicate enrollments, can only cancel active enrollments

- 2.2 Value Objects (Branded Types)

1. StudentId: "STU" + 6 digits (e.g., "STU123456")
2. CourseCode: 2-4 letters + 3 digits (e.g., "CS101")
3. Email: Valid email format
4. Credits: Only 1, 2, 3, 4, or 6
5. Semester: "(Fall|Spring|Summer)YYYY" (e.g., "Fall2024")
6. EnrollmentId: "ENR" + unique identifier

## 3. Business Rules

1. Course Capacity Rule: Cannot enroll beyond capacity
2. Student Credit Limit Rule: Max 18 credits per semester
3. Valid Branded Types Rule: All values validated via smart constructors
4. Enrollment Uniqueness Rule: No duplicate student+course+semester

## 4. Branded Types Requirements

Students implement branded types from scratch:

```typescript
type Brand<K, T> = K & { __brand: T }
type StudentId = Brand<string, "StudentId">

function createStudentId(value: string): StudentId | Error {
	// Validate format
	// Return branded type or Error
}
```

**Requirements:**

- Smart constructor for each type
- Returns Type | Error
- "Parse, Don't Validate" principle
- No any types

## 5. Observer Pattern Requirements

- 5.1 Events:

StudentEnrolled - When student enrolls successfully
EnrollmentCancelled - When enrollment is cancelled
CourseCapacityReached - Course at 80% capacity
CourseFull - Course at 100% capacity

- 5.2 Interface:

```typescript
subscribe<T>(eventType: string, handler: (event: T) => void): void;
unsubscribe<T>(eventType: string, handler: (event: T) => void): void;
emit<T>(eventType: string, payload: T): void;
```

## 6. What's Provided (Boilerplate)

- package.json + tsconfig.json
- Folder structure: src/domain/, src/infrastructure/
- Base EventEmitter interface
- CLI entry point

## 7. What Students Build

6 branded types with smart constructors
3 entity classes
Observer pattern implementation
Business logic enforcing all rules
CLI demonstrating 5 scenarios

## 8. CLI Scenarios

1. Successful enrollment → StudentEnrolled event
2. Course reaches 80% → CourseCapacityReached event
3. Course becomes full → CourseFull event
4. Student exceeds 18 credits → Fails, no event
5. Enrollment cancellation → EnrollmentCancelled event

## 9. Evaluation Criteria

Type Safety (30%): Branded types, no any, compile-time safety
Domain Design (30%): Entities enforce invariants, immutable value objects
Observer Pattern (20%): Subscribe/unsubscribe works, typed events
Code Quality (10%): Clean, separated concerns
Working Demo (10%): All scenarios work
