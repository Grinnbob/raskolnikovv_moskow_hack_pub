export interface ValidationResponse {
  success: boolean;
  error?: string;
  errorCode?: 1 | 2 | 3; // 1 = verification code wrong, 2 = expired, 3 = internal error
}
