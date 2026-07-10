import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export function apiResponse<T = unknown>(
  status: number,
  message: string,
  data?: T,
  error?: string,
): ApiResponse<T> {
  return {
    status,
    message,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}

export function success<T = unknown>(
  res: Response,
  data?: T,
  message = 'Operación exitosa',
  statusCode = 200,
): void {
  res.status(statusCode).json(apiResponse(statusCode, message, data));
}

export function error(
  res: Response,
  message: string,
  statusCode = 500,
  errorMsg?: string,
): void {
  res.status(statusCode).json(apiResponse(statusCode, message, undefined, errorMsg ?? message));
}
