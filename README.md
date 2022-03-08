# Univeristy Scheduler

| Student | Virghileanu Teodor |
| ------- | ------------------ |
| Group   | 30431              |

## Contents

- [Univeristy Scheduler](#univeristy-scheduler)
  - [Contents](#contents)
  - [Project specification](#project-specification)
  - [Domain model](#domain-model)
    - [Person Domain](#person-domain)
    - [University Domain](#university-domain)
  - [Usecase Model](#usecase-model)
    - [User role assignation](#user-role-assignation)
    - [User permission](#user-permission)
    - [Faculty & Course creation](#faculty--course-creation)
    - [Assigning tasks](#assigning-tasks)
    - [Calendar check](#calendar-check)
  - [Users and stakeholers](#users-and-stakeholers)

<div class="page" />

## Project specification

The **University Scheduler** is a platform dedicated for **scheduling university related tasks and events** while also allowing **administrators** to manage its teachers, staff members and students. Of course, each actor can independently manage its own adequate resources.

The current delivery model envisioned is **Hosted Software**, not **SaaS**.

## Domain model

### Person Domain

```mermaid
classDiagram
  direction TB
  Enrollment --* "many" FacultyPerson : Contains

  Person <|-- FacultyPerson
  FacultyPerson <|-- Student
  FacultyPerson <|-- Teacher
  FacultyPerson <|-- Staff

  Student ..|> ContainsWork
  Teacher ..|> ContainsWork
  Staff ..|> ContainsWork

  Student ..|> Work
  Teacher ..|> Work
  Staff ..|> Work

  class Person {
    -String name
    -String email
    -Date birthDate
    -String phoneNumber
    -String cnp
  }
  class FacultyPerson {
    -List~Enrollment~ enrollments
  }
  class Work {
    +work()
    +complete(Task) boolean
    +isCompleted(Task) boolean
  }
  class ContainsWork {
    +hasWorkNow() boolean
    +todoNow() Task
    +todoToday() List~Task~
    +todoWeek() List~Task~
    +todoMonth() List~Task~
  }
  class Teacher {
  }
  class Staff {
  }
  class Student {
  }

  class Enrollment {
    -String ID
    -Faculty faculty
  }
```

<div class="page" />

### University Domain

```mermaid
classDiagram
  direction TB
  Faculty --* Enrollment
  Faculty --* "many" University : Contains
  Course --* "many" Faculty : Has
  Task --* "many" Course : Has

  Faculty ..|> ContainsWork
  Course ..|> ContainsWork
  Faculty ..|> ContainsWork

  class ContainsWork {
    +hasWorkNow() boolean
    +todoNow() Task
    +todoToday() List~Task~
    +todoWeek() List~Task~
    +todoMonth() List~Task~
  }
  class Enrollment {
    -String ID
    -Faculty faculty
  }
  class University {
    -String name
    -List~Faculty~ faculties
  }
  class Faculty {
    -List~Course~ courses
    -String name
    -String description
  }
  class Course {
    -String name
    -String description
    -Set~Date, Task~ tasks
  }
  class Task {
    -DateRange range
    -String name
    -String description
    +onDate() Date
  }
```

<div class="page" />

## Usecase Model

### User role assignation

This usecase covers **invitations** to the platform as well. Once an actor is invited, it also receives a platform invitation followed by a **mandatory profile onboarding**.

```mermaid
sequenceDiagram
  actor Student
  actor Teacher
  actor Admin

  Admin ->> Teacher: Invite to faculty
  Note right of Teacher: Accept invitation

  Admin ->> Teacher: Assign courses

  Teacher ->> Student: Invite to class

  Student ->> Teacher: Accept invitation

  Note over Student: ~ Profile Onboarding
```

From now on, users can use the platform independently of each other.

<div class="page" />

### User permission

Some **teachers** can have *different permissions* on the platform. For example, a teacher can be an **administrator** given the right permissions.

The same goes for **Staff members**.

```mermaid
sequenceDiagram
  actor Staff
  actor Teacher
  actor Admin

  Staff ->> Teacher: Request a permission privilage
  Teacher -->> Staff: Sorry, I don't have the privilege

  Teacher ->> Admin: Request a permission privilage
  Admin ->> Teacher: Validate permission request

  Staff ->> Teacher: Request a permission privilage
  Teacher ->> Staff: Validate permission request
```

Each actor can independently assign permissions to other actors if they have the required priviledges.

<div class="page" />

### Faculty & Course creation

This usecase covers the **admin** creating a **faculty** for a university and assigning **courses** to it. Currently, courses **are not independent** of faculties, since we don't cover the case in which a teacher has activity across *multiple universities*. Each course is unique to a faculty.

```mermaid
sequenceDiagram
  participant Course
  participant Faculty
  actor Admin

  Admin ->> Faculty: Create
  Admin ->> Faculty: Visit dedicated page
  Admin ->> Course: Create
  Note over Course, Faculty: Course is linked to Faculty
```

<div class="page" />

### Assigning tasks

Since permissions exist, the administrator **is not the only one** capable of creating and assigning tasks. Because of this, a different actor name will be used to describe the user which is able to create tasks.

```mermaid
sequenceDiagram
  participant Task
  participant Course
  actor Scheduler

  Scheduler ->> Course: Assert creation
  Note over Scheduler, Course: The course is created
  Scheduler ->> Course: Visit dedicated page
  Scheduler ->> Task: Assert availability
  Note over Task, Course: The task fits in the timeframe
  Scheduler ->> Task: Create
```

<div class="page" />

### Calendar check

Viewing the calendar and inspecting individual elements is trivial.

```mermaid
sequenceDiagram
  participant Calendar
  actor User

  User ->> Calendar: Visit dedicated page
  User ->> Calendar: Inspect monthly overview
  User ->> Calendar: Inspect weekly overview
  User ->> Calendar: Click date
  User ->> Calendar: Inspect detailed tasks
```

## Users and stakeholers

The stakeholders of this application are **university leading members**. They are the one who benefit from the platform and they can be positively or negatively affected by the business.

As a consequence, the users of the application are **students**, whose presence on the platform is optional.
