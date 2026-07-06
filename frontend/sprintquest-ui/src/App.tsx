import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AppLayout } from "./components/layout/AppLayout";
import { BoardPage } from "./pages/BoardPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProgressPage } from "./pages/ProgressPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TaskDetailsPage } from "./pages/TaskDetailsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  );
}