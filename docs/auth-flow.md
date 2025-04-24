# OAuth 인증 흐름 가이드

Dream Catcher 서비스의 OAuth 인증은 웹과 앱 환경 모두를 지원합니다. 이 문서는 각 환경에서의 인증 흐름을 설명합니다.

## 1. 웹 환경 인증 흐름

### 1.1 인증 프로세스

1. 프론트엔드에서 인증 URL 요청

   ```http
   GET /auth/kakao/url?platform=web
   ```

2. 서버로부터 카카오 로그인 URL 수신

   ```json
   {
     "url": "https://kauth.kakao.com/oauth/authorize?client_id=...&redirect_uri=..."
   }
   ```

3. 사용자를 카카오 로그인 페이지로 리다이렉트
4. 카카오 인증 완료 후 서버의 콜백 URL로 리다이렉트

   ```
   GET /auth/kakao/callback/web?code={인증코드}
   ```

5. 서버에서 프론트엔드로 토큰과 함께 리다이렉트
   ```
   프론트엔드 URL?access_token={JWT토큰}&refresh_token={리프레시토큰}
   ```

### 1.2 구현 예시 (프론트엔드)

```typescript
async function startKakaoLogin() {
  try {
    const response = await fetch('/auth/kakao/url?platform=web');
    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('카카오 로그인 초기화 실패:', error);
  }
}

// 콜백 페이지에서
function handleAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken && refreshToken) {
    // 토큰 저장 및 사용자 상태 업데이트
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
}
```

## 2. 앱 환경 인증 흐름

### 2.1 인증 프로세스

1. 앱에서 인증 URL 요청

   ```http
   GET /auth/kakao/url?platform=app
   ```

2. 서버로부터 카카오 로그인 URL 수신 (앱 스킴 포함)

   ```json
   {
     "url": "https://kauth.kakao.com/oauth/authorize?client_id=...&redirect_uri=dreamcatcher://oauth/kakao/callback"
   }
   ```

3. 앱에서 웹뷰/커스텀 탭으로 카카오 로그인 페이지 열기
4. 카카오 인증 완료 후 앱 스킴으로 리다이렉트

   ```
   dreamcatcher://oauth/kakao/callback?code={인증코드}
   ```

5. 앱에서 인증 코드로 토큰 교환 요청

   ```http
   GET /auth/kakao/callback/app?code={인증코드}
   ```

6. 서버에서 JSON 응답으로 토큰과 사용자 정보 반환
   ```json
   {
     "accessToken": "JWT토큰",
     "refreshToken": "리프레시토큰",
     "user": {
       "id": "사용자ID",
       "email": "이메일",
       "nickname": "닉네임",
       "profileImage": "프로필이미지URL"
     }
   }
   ```

### 2.2 구현 예시 (Android)

```kotlin
class AuthManager {
    suspend fun startKakaoLogin() {
        try {
            val response = api.getKakaoAuthUrl("app")
            val authUrl = response.url

            CustomTabsIntent.Builder()
                .build()
                .launchUrl(context, Uri.parse(authUrl))
        } catch (e: Exception) {
            Log.e("Auth", "카카오 로그인 초기화 실패", e)
        }
    }
}

class MainActivity : AppCompatActivity() {
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)

        val uri = intent?.data
        if (uri?.scheme == "dreamcatcher" && uri.host == "oauth") {
            val code = uri.getQueryParameter("code")
            code?.let {
                viewModel.exchangeCodeForToken(it)
            }
        }
    }
}

// AndroidManifest.xml
<activity android:name=".MainActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="dreamcatcher"
              android:host="oauth" />
    </intent-filter>
</activity>
```

### 2.3 구현 예시 (iOS)

```swift
class AuthManager {
    func startKakaoLogin() async {
        do {
            let response = try await api.getKakaoAuthUrl(platform: "app")
            let authUrl = response.url

            let session = ASWebAuthenticationSession(
                url: URL(string: authUrl)!,
                callbackURLScheme: "dreamcatcher"
            ) { callbackURL, error in
                guard let url = callbackURL else { return }
                let code = URLComponents(url: url, resolvingAgainstBaseURL: true)?
                    .queryItems?
                    .first { $0.name == "code" }?
                    .value

                Task {
                    await self.exchangeCodeForToken(code)
                }
            }
            session.start()
        } catch {
            print("카카오 로그인 초기화 실패: \(error)")
        }
    }
}

// Info.plist
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>dreamcatcher</string>
        </array>
    </dict>
</array>
```

## 3. 환경 변수 설정

### 3.1 서버 환경 변수

```env
# Kakao OAuth
KAKAO_CLIENT_ID=your_client_id
KAKAO_CLIENT_SECRET=your_client_secret
KAKAO_WEB_REDIRECT_URI=http://localhost:3000/auth/kakao/callback/web
KAKAO_APP_REDIRECT_URI=dreamcatcher://oauth/kakao/callback

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
```

## 4. 보안 고려사항

### 4.1 CSRF 방지

- 웹과 앱 모두에서 state 파라미터를 사용하여 CSRF 공격 방지
- 인증 요청 시 생성된 state 값과 콜백으로 전달받은 state 값 비교

### 4.2 토큰 보안

- 앱에서는 토큰을 안전한 저장소에 보관 (iOS: Keychain, Android: EncryptedSharedPreferences)
- 웹에서는 HttpOnly 쿠키 사용 권장
- 모든 API 요청에 JWT 토큰을 Authorization 헤더로 전송

### 4.3 에러 처리

- 인증 실패 시 적절한 에러 메시지와 함께 사용자에게 피드백 제공
- 토큰 만료 시 자동으로 리프레시 토큰을 사용하여 갱신
- 리프레시 토큰 만료 시 사용자에게 재로그인 요청
