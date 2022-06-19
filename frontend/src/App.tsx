import { Route, Routes } from 'solid-app-router';
import { Component } from 'solid-js';
import CoursePage from './pages/CoursePage';
import CoursesPage from './pages/CoursesPage';
import FacultiesPage from './pages/FacultiesPage';
import FacultyPage from './pages/FacultyPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskPage from './pages/TaskPage';
import TasksPage from './pages/TasksPage';
import UniversityPage from './pages/UniversityPage';
import UniversitiesPage from './pages/UniversitiesPage';

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/university" element={<UniversitiesPage />} />
      <Route path="/university/:id" element={<UniversityPage />} />

      <Route path="/faculty" element={<FacultiesPage />} />
      <Route path="/faculty/:id" element={<FacultyPage />} />

      <Route path="/course" element={<CoursesPage />} />
      <Route path="/course/:id" element={<CoursePage />} />

      <Route path="/task" element={<TasksPage />} />
      <Route path="/task/:id" element={<TaskPage />} />
    </Routes>
  );
};

export default App;
