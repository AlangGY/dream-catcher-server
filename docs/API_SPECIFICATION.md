# Dream Catcher API 명세서

## 기본 정보

- Base URL: `https://api.dreamcatcher.com/v1`
- 인증 방식: Bearer Token (JWT)
- 응답 형식: JSON
- 시간 형식: ISO 8601 (UTC)

## 공통 응답 형식

### 성공 응답

```json
{
  "status": "success",
  "data": {
    // 실제 응답 데이터
  }
}
```

### 에러 응답

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

## 인증 API

### 회원가입

- **POST** `/auth/register`

```json
// Request
{
  "email": "string",
  "password": "string",
  "name": "string"
}

// Response
{
  "status": "success",
  "data": {
    "userId": "string",
    "token": "string"
  }
}
```

### 로그인

- **POST** `/auth/login`

```json
// Request
{
  "email": "string",
  "password": "string"
}

// Response
{
  "status": "success",
  "data": {
    "userId": "string",
    "token": "string",
    "name": "string"
  }
}
```

### 소셜 로그인 (카카오)

- **POST** `/auth/kakao`

```json
// Request
{
  "accessToken": "string"
}

// Response
{
  "status": "success",
  "data": {
    "userId": "string",
    "token": "string",
    "name": "string"
  }
}
```

## 꿈 기록 API

### 꿈 기록 생성

- **POST** `/dreams`

```json
// Request
{
  "title": "string",
  "content": "string",
  "date": "string (ISO 8601)",
  "emotions": ["string"],
  "tags": ["string"]
}

// Response
{
  "status": "success",
  "data": {
    "dreamId": "string",
    "title": "string",
    "content": "string",
    "date": "string",
    "emotions": ["string"],
    "tags": ["string"],
    "createdAt": "string"
  }
}
```

### 꿈 기록 목록 조회

- **GET** `/dreams`
- Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)

```json
// Response
{
  "status": "success",
  "data": {
    "dreams": [
      {
        "dreamId": "string",
        "title": "string",
        "content": "string",
        "date": "string",
        "emotions": ["string"],
        "tags": ["string"],
        "createdAt": "string"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100
    }
  }
}
```

### 꿈 기록 상세 조회

- **GET** `/dreams/{dreamId}`

```json
// Response
{
  "status": "success",
  "data": {
    "dreamId": "string",
    "title": "string",
    "content": "string",
    "date": "string",
    "emotions": ["string"],
    "tags": ["string"],
    "analysis": {
      "interpretation": "string",
      "keywords": ["string"],
      "emotionalTone": "string",
      "suggestedActions": ["string"]
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 꿈 기록 수정

- **PUT** `/dreams/{dreamId}`

```json
// Request
{
  "title": "string",
  "content": "string",
  "date": "string",
  "emotions": ["string"],
  "tags": ["string"]
}

// Response
{
  "status": "success",
  "data": {
    "dreamId": "string",
    "title": "string",
    "content": "string",
    "date": "string",
    "emotions": ["string"],
    "tags": ["string"],
    "updatedAt": "string"
  }
}
```

### 꿈 기록 삭제

- **DELETE** `/dreams/{dreamId}`

```json
// Response
{
  "status": "success",
  "data": {
    "message": "Dream deleted successfully"
  }
}
```

## 꿈 분석 API

### 꿈 분석 요청

- **POST** `/dreams/{dreamId}/analyze`

```json
// Response
{
  "status": "success",
  "data": {
    "dreamId": "string",
    "analysis": {
      "interpretation": "string",
      "keywords": ["string"],
      "emotionalTone": "string",
      "suggestedActions": ["string"]
    },
    "analyzedAt": "string"
  }
}
```

### 분석 통계 조회

- **GET** `/analysis/statistics`
- Query Parameters:
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)

```json
// Response
{
  "status": "success",
  "data": {
    "emotionTrends": [
      {
        "emotion": "string",
        "count": 0,
        "percentage": 0
      }
    ],
    "commonThemes": [
      {
        "theme": "string",
        "count": 0
      }
    ],
    "dreamFrequency": {
      "total": 0,
      "averagePerWeek": 0,
      "byDayOfWeek": {
        "monday": 0,
        "tuesday": 0
        // ...
      }
    }
  }
}
```

## 프로필 API

### 프로필 조회

- **GET** `/profile`

```json
// Response
{
  "status": "success",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string",
    "dreamStats": {
      "totalDreams": 0,
      "analyzedDreams": 0,
      "mostCommonEmotions": ["string"],
      "mostCommonThemes": ["string"]
    }
  }
}
```

### 프로필 수정

- **PUT** `/profile`

```json
// Request
{
  "name": "string",
  "profileImage": "string"
}

// Response
{
  "status": "success",
  "data": {
    "userId": "string",
    "name": "string",
    "profileImage": "string",
    "updatedAt": "string"
  }
}
```

## OpenAI API

### WebRTC 인증키 발급

- **POST** `/openai/auth/webrtc`

```json
// Request
{
  "userId": "string"
}

// Response
{
  "status": "success",
// 시그널링 메시지
{
  "type": "string", // "offer" | "answer" | "ice-candidate"
  "sessionId": "string",
  "data": {
    "ephemeralKey": "string",
  }
}
```

## 에러 코드

| 코드         | 설명                 |
| ------------ | -------------------- |
| AUTH_001     | 인증 실패            |
| AUTH_002     | 토큰 만료            |
| AUTH_003     | 잘못된 토큰          |
| DREAM_001    | 꿈 기록 생성 실패    |
| DREAM_002    | 꿈 기록 찾을 수 없음 |
| ANALYSIS_001 | 분석 처리 실패       |
| PROFILE_001  | 프로필 업데이트 실패 |
| SERVER_001   | 내부 서버 오류       |
