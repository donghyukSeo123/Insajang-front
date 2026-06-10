import axios from "axios";

/** @type {import('axios').AxiosInstance} */
const API = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:8080", 
  timeout: 5000,
});

let isRefreshing = false;
let failedQueue = [];

// 대기 중인 요청들을 처리하는 헬퍼 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 요청 인터셉터: 모든 API 호출 전에 Authorization 헤더에 Access Token 주입
API.interceptors.request.use(
  (config) => {
    const rawData = localStorage.getItem("accessToken");
    if (rawData) {
      // 앞뒤 따옴표 제거 후 헤더에 Bearer 토큰 주입
      const token = rawData.replace(/^"|"$/g, ''); 
      config.headers.Authorization = `Bearer ${token}`;
      console.log("전송되는 헤더:", config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 Unauthorized 감지 시 토큰 재발급 자동 수행 (Silent Reissue)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 에러 응답이 왔고, 401 Unauthorized 이며, 아직 재시도하지 않은 요청인 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // 💡 로그인 요청(/api/user/login)에서 발생한 401 에러는 토큰 만료가 아닌 비밀번호/아이디 틀림이므로 재발급을 시도하지 않고 즉시 거절합니다.
      if (originalRequest.url && originalRequest.url.includes("/api/user/login")) {
        return Promise.reject(error);
      }

      // 토큰 재발급 요청 자체가 401 에러를 낸 경우는 리프레시 토큰마저 만료된 상태이므로 강제 로그아웃
      if (originalRequest.url && originalRequest.url.includes("/api/user/reissue")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("username");
        window.location.href = "/authentication/sign-in";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // 이미 다른 API 요청에 의해 토큰 갱신이 진행 중이라면 큐에 등록하여 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const rawRefreshToken = localStorage.getItem("refreshToken");
        if (!rawRefreshToken) {
          throw new Error("No refresh token available");
        }
        const refreshToken = rawRefreshToken.replace(/^"|"$/g, '');

        // 💡 중요: 순수 axios 객체로 재발급 요청을 전송하여 헤더 중첩 및 무한 루프 차단
        const reissueUrl = process.env.NODE_ENV === "production" ? "/api/user/reissue" : "http://localhost:8080/api/user/reissue";
        const res = await axios.post(reissueUrl, {
          refreshToken: refreshToken,
        });

        if (res.status === 200) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

          // 발급받은 새로운 토큰들을 금고(localStorage)에 저장
          localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
          localStorage.setItem("refreshToken", JSON.stringify(newRefreshToken));

          // 기본 헤더 및 실패했던 originalRequest의 헤더를 갱신
          API.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 대기 큐의 요청들을 새 토큰으로 일괄 실행 처리
          processQueue(null, newAccessToken);
          isRefreshing = false;

          return API(originalRequest); // 기존 요청 재실행
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        alert("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("username");
        window.location.href = "/authentication/sign-in";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;