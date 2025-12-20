import { AxiosError } from "axios";

type BackendErrorShape =
  | string
  | {
      message?: string;
      error?: string;
      errors?: string[];
      details?: { message?: string }[];
    };

export function normalizeApiError(
  error: unknown,
  fallback = "An unexpected error occurred"
): string {
  // Axios error (most API failures)
  if (error instanceof AxiosError) {
    const data: BackendErrorShape | undefined = error.response?.data;

    if (!data) {
      return error.message || fallback;
    }

    // Backend returned plain string
    if (typeof data === "string") {
      return data;
    }

    // Common backend conventions
    if (data.message) {
      return data.message;
    }

    if (data.error) {
      return data.error;
    }

    // Validation errors (array-based)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0];
    }

    // Nested validation formats
    if (Array.isArray(data.details) && data.details[0]?.message) {
      return data.details[0].message;
    }

    return fallback;
  }

  // Native JS error
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
