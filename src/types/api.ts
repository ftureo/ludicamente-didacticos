export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function apiSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function apiError(error: string, status?: number): Response {
  return Response.json({ success: false, error } as ApiResponse, { status: status ?? 400 });
}

export function apiOk<T>(data: T, message?: string): Response {
  return Response.json(apiSuccess(data, message));
}
