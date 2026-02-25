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
        // JSON.parse를 쓰는 대신, 앞뒤 따옴표가 있다면 제거하는 방식이 더 안전합니다.
        const token = rawData.replace(/^"|"$/g, ''); 
        
        config.headers.Authorization = `Bearer ${token}`;
        console.log("전송되는 헤더:", config.headers.Authorization); // 여기서 따옴표 유무 확인!
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;