import api from './axios';
import type { ApiResponse, Project, CreateProjectData } from '../types';

export const projectsService = {

  async getAll(): Promise<Project[]> {
    const res = await api.get<ApiResponse<{ items: Project[]; count: number }>>('/projects');
    return res.data.data.items ?? [];
  },

  async getById(id: string): Promise<Project> {
    const res = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data;
  },

  async create(data: CreateProjectData): Promise<Project> {
    const res = await api.post<ApiResponse<Project>>('/projects', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const res = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
