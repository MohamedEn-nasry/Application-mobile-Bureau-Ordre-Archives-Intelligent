import { ServerFailure } from './failures';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message);
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 'high');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 'medium');
  }
}

export class FileNotFoundError extends AppError {
  constructor(filename: string) {
    super(`File not found: ${filename}`, 'FILE_NOT_FOUND', 'medium');
  }
}

export class FileSizeError extends AppError {
  constructor(size: number, maxSize: number) {
    super(`File size ${size}MB exceeds maximum ${maxSize}MB`, 'FILE_SIZE_ERROR', 'medium');
  }
}

export class PermissionError extends AppError {
  constructor(permission: string) {
    super(`Permission denied: ${permission}`, 'PERMISSION_ERROR', 'high');
  }
}

export class OCRProcessingError extends AppError {
  constructor(message: string) {
    super(message, 'OCR_PROCESSING_ERROR', 'medium');
  }
}

export class ClassificationError extends AppError {
  constructor(message: string) {
    super(message, 'CLASSIFICATION_ERROR', 'medium');
  }
}

export const handleApiError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error?.response?.status === 401) {
    return new AppError('Unauthorized access', 'UNAUTHORIZED', 'high');
  }

  if (error?.response?.status === 403) {
    return new AppError('Access forbidden', 'FORBIDDEN', 'high');
  }

  if (error?.response?.status === 404) {
    return new AppError('Resource not found', 'NOT_FOUND', 'medium');
  }

  if (error?.response?.status >= 500) {
    return new AppError('Server error occurred', 'SERVER_ERROR', 'high');
  }

  if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
    return new NetworkError('Network connection failed');
  }

  // Default fallback
  return new AppError(error?.message || 'An unexpected error occurred', 'UNKNOWN_ERROR', 'medium');
};

export const getErrorMessage = (error: AppError | ServerFailure | null | undefined): string => {
  if (!error) {
    return 'No error information available';
  }

  if (error instanceof ServerFailure) {
    return error.message;
  }

  if (error instanceof AppError) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const getErrorSeverity = (error: AppError | ServerFailure | null | undefined): 'low' | 'medium' | 'high' => {
  if (!error) {
    return 'medium';
  }

  if (error instanceof ServerFailure) {
    return 'high'; // Server failures are typically high severity
  }

  if (error instanceof AppError) {
    return error.severity;
  }

  return 'medium';
};
