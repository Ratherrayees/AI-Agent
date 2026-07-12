export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime?: number;
}

export function successResponse<T>(data: T, executionTime?: number): ApiResponse<T> {
  return {
    success: true,
    data,
    executionTime,
  };
}

export function errorResponse(error: string, executionTime?: number): ApiResponse {
  return {
    success: false,
    error,
    executionTime,
  };
}

export function sendAppwriteResponse(res: any, responseData: ApiResponse, statusCode = 200) {
  return res.json(responseData, statusCode, {
    'Content-Type': 'application/json',
  });
}
