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

// 💡 2. 응답 인터셉터 추가: 서버에서 온 답변을 가로채서 401(만료) 검사!
API.interceptors.response.use(
  (response) => {
    // 서버 응답이 성공(2xx)하면 아무 작업 없이 그대로 데이터를 넘겨줍니다.
    return response;
  },
  (error) => {
    // 에러 응답이 왔고, 그 에러 코드가 401 Unauthorized(토큰 만료 등)라면
    if (error.response && error.response.status === 401) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
      
      // 💡 동혁님의 금고 key 이름인 'accessToken'으로 정확히 삭제
      // 💡 토큰과 유저네임을 세트로 깔끔하게 삭제!
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("username");
      
      // 💡 navigate 대신 브라우저 강제 이동 사용
      window.location.href = "/authentication/sign-in";
    }
    
    // 401 에러가 아니거나 처리가 끝난 후 에러를 그대로 리턴
    return Promise.reject(error);
  }
);

export default API;