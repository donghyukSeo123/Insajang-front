import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// API 유틸리티
import API from "utils/api";

// Flat Vector SVG Logo Component representing C + Magic Sparkle
const ContentsMakerLogo = () => (
  <svg viewBox="0 0 100 100" width="80" height="80">
    <defs>
      <linearGradient id="slateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" /> {/* Clean Cyan */}
        <stop offset="100%" stopColor="#818cf8" /> {/* Clean Indigo */}
      </linearGradient>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    
    {/* Minimalist Vector "C" Emblem */}
    <path 
      d="M 50,14 A 36,36 0 1,0 86,50 C 86,39 79,32 74,32" 
      fill="none" 
      stroke="url(#slateGrad)" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />
    
    {/* Inner Accent Ring */}
    <path 
      d="M 50,28 A 22,22 0 1,0 68,50 C 68,41 53,43 53,35" 
      fill="none" 
      stroke="url(#slateGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      opacity="0.7"
    />
    
    {/* Sharp 4-Point Star Sparkle (Top-Right Gap) */}
    <path 
      d="M 77,15 Q 77,25 67,25 Q 77,25 77,35 Q 77,25 87,25 Q 77,25 77,15 Z" 
      fill="url(#starGrad)" 
    />
    
    {/* Decorative Accent Dot */}
    <circle cx="56" cy="20" r="1.5" fill="#38bdf8" />
  </svg>
);

function Basic() {
  const navigate = useNavigate();

  // 1. 제어 컴포넌트 객체화
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // 로그인 제출 로직
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await API.post("/api/user/login", values);

      if (response.status === 200) {
        alert("로그인 성공! 환영합니다.");
        console.log('로그인 유저명 :' + JSON.stringify(response.data.userName));
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
        localStorage.setItem("userName", response.data.userName);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert(error.response?.data || "로그인 정보를 다시 확인해주세요.");
    }
  };

  // 포트폴리오 체험용 게스트(테스트) 계정 1초 로그인 로직 (DB가 비어있을 시 자동 회원가입 진행)
  const handleGuestLogin = async () => {
    const guestCredentials = {
      email: "portfolio-guest@insajang.com",
      password: "guest1234",
    };

    try {
      // 1. 기존 게스트 계정으로 로그인 시도
      const loginRes = await API.post("/api/user/login", guestCredentials);
      if (loginRes.status === 200) {
        localStorage.setItem("accessToken", JSON.stringify(loginRes.data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(loginRes.data.refreshToken));
        localStorage.setItem("userName", loginRes.data.userName);
        alert("게스트 계정으로 로그인되었습니다! 즐거운 체험 되세요.");
        window.location.href = "/dashboard";
      }
    } catch (loginError) {
      // 2. 로그인 실패 시 (계정이 DB에 아직 존재하지 않는 경우) 자동 회원가입 처리 후 재로그인
      console.log("Guest account does not exist. Auto-registering guest...");
      try {
        const signUpData = {
          email: "portfolio-guest@insajang.com",
          password: "guest1234",
          nickname: "게스트",
          name: "게스트",
        };
        const signupRes = await API.post("/api/user/join", signUpData);
        if (signupRes.status === 200 || signupRes.status === 201) {
          const loginRes = await API.post("/api/user/login", guestCredentials);
          if (loginRes.status === 200) {
            localStorage.setItem("accessToken", JSON.stringify(loginRes.data.accessToken));
            localStorage.setItem("refreshToken", JSON.stringify(loginRes.data.refreshToken));
            localStorage.setItem("userName", loginRes.data.userName);
            alert("게스트 계정이 자동 생성되어 로그인되었습니다! 즐거운 체험 되세요.");
            window.location.href = "/dashboard";
          }
        }
      } catch (signupError) {
        console.error("Auto guest register failed:", signupError);
        alert("게스트 로그인 진행 중 에러가 발생했습니다. 직접 회원가입을 이용해 주세요.");
      }
    }
  };


  return (
    <BasicLayout>
      <Card
        sx={{
          maxWidth: 460,
          mx: "auto",
          mt: 8,
          pt: 5,
          pb: 4,
          background: "rgba(15, 23, 42, 0.75)", // slate-900 with high contrast opacity
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          borderRadius: "20px",
        }}
      >
        <MDBox px={4}>
          {/* ===== 로고 영역 ===== */}
          <MDBox display="flex" flexDirection="column" alignItems="center" mb={4}>
            <MDBox mb={1.5}>
              <ContentsMakerLogo />
            </MDBox>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: "-0.5px" }}>
              콘텐츠메이커 스튜디오
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5 }}>
              자동 콘텐츠 생성 · 예약 · 관리
            </MDTypography>
          </MDBox>

          {/* ===== 로그인 폼 ===== */}
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <MDBox mb={2.5}>
              <MDInput
                name="email"
                type="email"
                label="이메일 주소"
                fullWidth
                variant="outlined"
                value={values.email}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.35)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#38bdf8", // Sky blue focus
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 14px !important", // vertical padding adjustment
                    lineHeight: "1.5 !important",
                    fontSize: "0.95rem !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4 !important",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                    "&.Mui-focused": {
                      color: "#38bdf8",
                    },
                  },
                }}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                name="password"
                type="password"
                label="비밀번호"
                fullWidth
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.15)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.35)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#38bdf8",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 14px !important",
                    lineHeight: "1.5 !important",
                    fontSize: "0.95rem !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4 !important",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                    "&.Mui-focused": {
                      color: "#38bdf8",
                    },
                  },
                }}
              />
            </MDBox>

            {/* 찾기 링크 분리 배치 */}
            <MDBox display="flex" justifyContent="flex-end" alignItems="center" mb={1} mt={1.5}>
              <MDBox display="flex" alignItems="center">
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{ 
                    color: "#38bdf8", 
                    cursor: "pointer", 
                    transition: "color 0.2s",
                    "&:hover": { color: "#7dd3fc" }
                  }}
                  onClick={() => alert("준비 중인 기능입니다.")}
                >
                  아이디 찾기
                </MDTypography>
                <MDTypography variant="button" sx={{ color: "rgba(255, 255, 255, 0.2)", mx: 0.8 }}>
                  |
                </MDTypography>
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{ 
                    color: "#38bdf8", 
                    cursor: "pointer", 
                    transition: "color 0.2s",
                    "&:hover": { color: "#7dd3fc" }
                  }}
                  onClick={() => alert("준비 중인 기능입니다.")}
                >
                  비밀번호 찾기
                </MDTypography>
              </MDBox>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton 
                type="submit" 
                variant="contained" 
                fullWidth
                sx={{
                  background: "linear-gradient(135deg, #0284c7, #0369a1)", // professional slate sky blue gradient
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  borderRadius: "10px",
                  py: 1.2,
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                    boxShadow: "0 6px 16px rgba(2, 132, 199, 0.4)",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                로그인
              </MDButton>
            </MDBox>

            <MDBox mt={1.5} mb={1}>
              <MDButton 
                variant="outlined" 
                fullWidth
                onClick={handleGuestLogin}
                sx={{
                  color: "#38bdf8",
                  borderColor: "rgba(56, 189, 248, 0.4)",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  borderRadius: "10px",
                  py: 1.2,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.05)",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                테스트 계정으로 1초 로그인
              </MDButton>
            </MDBox>

            <MDBox mt={3.5} textAlign="center">
              <MDTypography variant="button" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>
                계정이 없으신가요?{" "}
                <MDTypography
                  component={Link}
                  to="/signup"
                  variant="button"
                  sx={{ 
                    color: "#f43f5e", // Rose pink for soft and readable primary link
                    fontWeight: "bold", 
                    transition: "color 0.2s",
                    "&:hover": { color: "#fb7185" } 
                  }}
                >
                  회원가입
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;