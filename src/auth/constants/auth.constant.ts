export const JWT_EXPIRES_IN = '7d';

export const AUTH_ERROR_MESSAGES = {
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  EMAIL_EXISTS: '이미 등록된 이메일입니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 잘못되었습니다.',
} as const;
