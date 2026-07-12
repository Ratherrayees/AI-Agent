import { ToolResponse } from '../types.js';

export function successResponse(data: any, executionTimeMs?: number): ToolResponse {
  return {
    success: true,
    data,
    executionTimeMs,
  };
}

export function errorResponse(error: string | Error, executionTimeMs?: number): ToolResponse {
  const message = error instanceof Error ? error.message : error;
  return {
    success: false,
    error: message,
    executionTimeMs,
  };
}

export function sendAppwriteResponse(res: any, response: ToolResponse, status: number = 200) {
  return res.json(response, status);
}
