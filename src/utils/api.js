import axios from "axios";

/** @type {import('axios').AxiosInstance} */
const API = axios.create({
  baseURL: "http://localhost:8080", 
  timeout: 5000,
});

// 인터셉터: 모든 요청 전에 실행되는 자동 매표소
API.interceptors.request.use(
  (config) => {
    // 1. 금고에서 날것의 데이터를 가져옵니다.
    const rawData = localStorage.getItem("accessToken");

    console.log(rawData);
    if (rawData) {
      try {
        // 2. ⭐ 핵심: 'token'이라는 이름을 여기서 정확히 정의합니다!
        const token = JSON.parse(rawData); 
        
        // 3. 위에서 정의한 'token'을 헤더에 담습니다.
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error("토큰 파싱 중 에러 발생:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;