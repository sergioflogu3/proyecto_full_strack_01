import api from './axios';
import type { ApiResponse, Comment, CreateCommentData } from '../types';

export const commentsService = {

  async getByTask(taskId: string): Promise<Comment[]> {
    const res = await api.get<ApiResponse<Comment[]>>(`/comments/task/${taskId}`);
    return res.data.data ?? [];
  },

  async create(data: CreateCommentData): Promise<Comment> {
    const res = await api.post<ApiResponse<Comment>>('/comments', data);
    return res.data.data;
  },
};
