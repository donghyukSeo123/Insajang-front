# 1단계: 빌드 스테이지 (Node.js를 사용하여 React 빌드)
FROM node:18-slim AS build
WORKDIR /app

# npm 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 정적 파일 빌드
COPY . .
RUN npm run build

# 2단계: 실행 스테이지 (Nginx를 사용하여 정적 HTML 서빙 및 리버스 프록시 작동)
FROM nginx:alpine
# 빌드된 결과물을 Nginx 홈 디렉토리로 이동
COPY --from=build /app/build /usr/share/nginx/html
# 작성한 nginx.conf 설정을 컨테이너 내부로 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
