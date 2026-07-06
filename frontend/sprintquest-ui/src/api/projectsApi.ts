import { apiGet } from "./apiClient";
import type { Project } from "../types/project";

export function getProjects() {
  return apiGet<Project[]>("/api/projects");
}