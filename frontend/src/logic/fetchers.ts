import { ListFetcher } from "../components/app/list/List";
import { Course } from "../types/models/course";
import { Faculty } from "../types/models/faculty";
import { University } from "../types/models/university";
import { Task } from "../types/models/task";
import { parseDeltaContent, parseDeltaDescription } from "./delta-parse";
import { expectJson, expectJsonArray } from "./fetching";
import { Rcomment } from "../types/models/rcomment";
import { Role, RoleCategory, RoleTitle } from "../types/models/user";

// LIST fetchers

export const universityListFetcher: ListFetcher<University, undefined> = async ({ token }) => {
  const universities = await fetch(`http://localhost:3000/university`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(expectJsonArray<University>(['id', 'name', 'description']))
    .then(unparsed => unparsed.map(parseDeltaDescription))
    .catch(e => {
      console.error(e);
      return [] as University[];
    });

  return universities;
};

export const facultyListFetcher: ListFetcher<Faculty, { universityId?: number }> = async ({ token, params }) => {
  const urlParams = new URLSearchParams();
  if (params.universityId) {
    urlParams.append('universityId', params.universityId.toString());
  }

  const faculties = await fetch(`http://localhost:3000/faculty?${urlParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(expectJsonArray<Faculty>(['id', 'name', 'description', 'universityId']))
    .then(unparsed => unparsed.map(parseDeltaDescription))
    .catch(e => {
      console.error(e);
      return [] as Faculty[];
    });

  return faculties;
};

export const courseListFetcher: ListFetcher<Course, { facultyId?: number }> = async ({ token, params }) => {
  const urlParams = new URLSearchParams();
  if (params.facultyId) {
    urlParams.append('facultyId', params.facultyId.toString());
  }

  const courses = await fetch(`http://localhost:3000/course?${urlParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(expectJsonArray<Course>(['id', 'name', 'description', 'facultyId']))
    .then(unparsed => unparsed.map(parseDeltaDescription))
    .catch(e => {
      console.error(e);
      return [] as Course[];
    });

  return courses;
};

export const taskListFetcher: ListFetcher<Task, { courseId?: number }> = async ({ token, params }) => {
  const urlParams = new URLSearchParams();
  if (params.courseId) {
    urlParams.append('courseId', params.courseId.toString());
  }

  const tasks = await fetch(`http://localhost:3000/task?${urlParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(expectJsonArray<Task>(['id', 'name', 'description', 'courseId']))
    .then(unparsed => unparsed.map(parseDeltaDescription))
    .catch(e => {
      console.error(e);
      return [] as Task[];
    });

  return tasks;
};

export const rcommentListFetcher: ListFetcher<Rcomment, { taskId?: number }> = async ({ token, params }) => {
  const urlParams = new URLSearchParams();
  if (params.taskId) {
    urlParams.append('taskId', params.taskId.toString());
  }

  const comments = await fetch(`http://localhost:3000/rcomment?${urlParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(expectJsonArray<Rcomment>(['id', 'userId', 'taskId', 'content']))
    .then(unparsed => unparsed.map(parseDeltaContent))
    .catch(e => {
      console.error(e);
      return [] as Rcomment[];
    });

  return comments;
};

// Other promise based fetching

export interface InviteUserParams {
  userId: number;
  subjectId: number;
  title: RoleTitle;
  category: RoleCategory;
  token: string;
}

export const inviteUser = async ({ token, ...rest }: InviteUserParams): Promise<Role> => {
  const role = await fetch(`http://localhost:3000/users/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...rest,
    }),
  })
    .then(expectJson<Role>(['id', 'userId', 'title', 'category']))
    .catch(e => {
      console.error(e);
      return null as Role;
    });

  return role;
};
