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
  - [Usecases](#usecases)
    - [University onboarding](#university-onboarding)
    - [User role assignation](#user-role-assignation)
    - [Assigning tasks](#assigning-tasks)
    - [Calendar check](#calendar-check)
  - [Users and stakeholers](#users-and-stakeholers)
  - [Architecture Design](#architecture-design)
    - [Non-functional requirements](#non-functional-requirements)
      - [Security](#security)
      - [Scalability](#scalability)
      - [Responsive design](#responsive-design)
      - [Performance and perceived quickness](#performance-and-perceived-quickness)
    - [Design constraints](#design-constraints)
  - [Database](#database)

<div class="page" />

## Project specification

The **University Scheduler** is a platform dedicated for **scheduling university related tasks and events** while also allowing **administrators** to manage its teachers, staff members and students. Of course, each actor can independently manage its own adequate resources.

The current delivery model envisioned is **Hosted Software**, not **SaaS**.

## Domain model

### Person Domain

```mermaid
classDiagram
  direction TB
  FacultyPerson "1" --> "*" Role : Has
  Role --> Student
  Role --> Teacher
  Role --> Staff

  University "1" --> "*" Faculty : Contains
  Faculty "1" --> "*" Course
  Course "1" --> "*" Task
  FacultyPerson "1" --> "*" Enrollment
  Enrollment "1" --> "1" Faculty

  Teacher --> Student : Assign course
  Teacher --> Staff : Assign course

  Admin --> "*" FacultyPerson : Assign role
  Admin --> "1" University : Create
  Admin --> "*" Faculty  : Create

  FacultyPerson "1" --> "1" Calendar : View
  Calendar "1" --> "*" Task : Display

  class Admin { }
  class FacultyPerson { }
  class Teacher { }
  class Staff { }
  class Student { }
  class Enrollment { }
  class University { }
  class Faculty { }
  class Course { }
  class Task { }
  class Calendar { }
```

<div class="page" />

## Usecases

### University onboarding

| Level              | Main actor |
| ------------------ | ---------- |
| Administrator-Goal | Admin      |

This usecase is aimed for the **onboarding of the application** itsef. Before having users and managing resources, the administrator needs to **create** a **university**, its **faculties**, its **courses** and optionally have a yearly schedule set up. The latter step is optional because other users can be assigned to this task *(such as teachers with higher privileges)*.

**Success scenario:**

1. Admin accesses the panel.
2. He sees the application onboarding page, since the app is not yet set up.
3. He completes the forms sequentially.
4. He sets up the university details.
5. He creates empty faculties.
6. He creates empty courses.
7. He sets up Faculty-Course relations.
8. He optionally sets up the schedule for each course.

### User role assignation

| Level              | Main actor |
| ------------------ | ---------- |
| Administrator-Goal | Admin      |

This usecase covers **invitations** to the platform as well. Once an actor is invited, it also receives a platform invitation followed by a **mandatory profile onboarding**. Role assignation is important because functionality on the platform is permission driven. **Teacher**, **Student** and **Staff** are just permission presets.

**Success scenario:**

1. Admin accesses the panel and visits the user management page.
2. Admin invites a new user to the platform.
3. Admin assigns roles prior to the new user onboarding.
4. New user can do specific role workflows.

<div class="page" />

### Assigning tasks

| Level        | Main actor |
| ------------ | ---------- |
| Teacher-Goal | Teacher    |

Since permissions exist, the administrator **is not the only one** capable of creating and assigning tasks. Because of this, a different actor name will be used to describe the user which is able to create tasks.

**Success scenario:**

1. Teacher selects a course.
2. Teacher invites one of his Students to the selected course.

Every task of the course will now be visible for each student of the course.

### Calendar check

Viewing the calendar and inspecting tasks is the target of the application. This action is not targetted to any kind of actor specifically, every user has the base privileges to view the calendar.

**Success scenario:**

1. User accesses the calendar
2. User inspects the weekly view
3. Student cries

<div style="width: 100%; height: 490px; display:flex; flex-direction:row; align-items:center; justify-content: center;">
<img src="diagrams/usecase/usecase.png" alt="usecase diagram" style="object-fit: cover;" />
</div>

<div class="page" />

## Users and stakeholers

The stakeholders of this application are **university leading members**. They are the one who benefit from the platform and they can be positively or negatively affected by the business. They manage all resources on the platform.

As a consequence, the users of the application are **students**, whose presence on the platform is also optional.

## Architecture Design

The Design principle for this web app's backend is a `3 Layer Architecture`.

<div style="width: 100%; height: 490px; display:flex; flex-direction:row; align-items:center; justify-content: center;">
<img src="./assets/layered_arch.png" style="object-fit: cover;" />
</div>

1. A controller’s sole purpose is to receive requests for the application and deal with routes.
2. The service layer should only include business logic. For example, all the CRUD operations and methods to determine how data can be created, stored and updated.
3. The data access layer takes care and provides logic to access data stored in persistent storage of some kind. For example an ODM like Mongoose, or ORM like TypeOrm

The framework of choise is [NestJS](https://nestjs.com/) ([docs](https://docs.nestjs.com/)) due to its **modularity** and **powerset of awesome features**.

The name is missleading, **typescript** will be used instead of plain **javascript**.

<div class="page" />

**Key features:**

* `ORM` via [TypeOrm](https://typeorm.io/)
* `Permissions` via [Casl](https://casl.js.org/v5/en/guide/intro)
* `JWT` and `local` auth strategies

### Non-functional requirements

#### Security

User credentials will be encrypted, and tokens will be signed with a `SECRET`.

The **JWT** token will encapsulate *non sensitive user data* and **permissions** which will later be used to reject **unauthorized requests**.

#### Scalability

This is a `non-problem` due to the way **NestJS** is build. Being modular allows for easy and flexible **scalability**.

#### Responsive design

A mobile-friendly responsive design is a must!

The frontend will be built using [Vue3](https://vuejs.org/) using its powerfull [CompositionAPI](https://vuejs.org/guide/extras/composition-api-faq.html). The styling library of choice will be [TailwindCSS](https://tailwindcss.com/) or other solutions based on tailwind such as [WindiCSS](https://windicss.org/).

This will allow for a **quick** and **beautiful design**, built in a **mobile first breakpoint system**.

#### Performance and perceived quickness

Webpages will be served quickly, packed as minimal as possible, and all requests will be asyncronous, so the user can enjoy a fast and smooth experience.

### Design constraints

* Technical constraints will require the database `seeding` and `migrating` features, such that the database is kept up to date and be populated with initial data before the **application onboarding**.
* A hash function is needed to encrypt user credentials.
* A UI library needs to be built before starting to implement the application design.

<div class="page" />

## Database

```mermaid
erDiagram
    Users ||--|{ Roles : has
    Users ||--|| Profile: has
    Users {
      string username
      string password
    }
    Roles {
      string name
    }
    Profile {
      string name
      string email
      string phone
      string cnp
      date birth
    }
    Users ||--|{ Enrolment : can_have
    Enrolment {
      int faculty_id
      int user_id
    }
    Enrolment }|--o{ Faculty : part_of
    University ||--|{ Faculty : contains
    University {
      string name
    }
    Faculty ||--|{ Courses : contains
    Faculty {
      string name
    }
    Courses ||--|{ Tasks : contains
    Courses {
      string name
      string description
    }
    Roles ||--|{ Tasks : for
    Tasks {
      role target
      string name
      date start
      date end
    }
```

<div class="page" />
