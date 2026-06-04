import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// API 유틸리티
import API from "utils/api";

// Layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Flat Vector SVG Logo Component representing C + Magic Sparkle (Consistent with Sign-In)
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
    
    {/* Sharp 4-Point Star Sparkle */}
    <path 
      d="M 77,15 Q 77,25 67,25 Q 77,25 77,35 Q 77,25 87,25 Q 77,25 77,15 Z" 
      fill="url(#starGrad)" 
    />
    
    {/* Decorative Accent Dot */}
    <circle cx="56" cy="20" r="1.5" fill="#38bdf8" />
  </svg>
);

function Cover() {
  const navigate = useNavigate();

  // 1. 상태값 선언
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const [isSent, setIsSent] = useState(false); // 메일 발송 여부
  const [isVerified, setIsVerified] = useState(false); // 메일인증 여부
  const [isNicknameAvailable, setIsNicknameAvailable] = useState({ message: "", color: "error" });
  const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)

  // 비밀번호 유효성 검사 (8자 이상, 영문/숫자 혼용)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordFormatValid = passwordRegex.test(password);
  const isPasswordEmpty = password === "";
  const isConfirmEmpty = confirmPassword === "";
  const isPasswordSame = password === confirmPassword;

  const passwordError = !isPasswordEmpty && !isPasswordFormatValid;
  const confirmError = !isConfirmEmpty && (!isPasswordSame || !isPasswordFormatValid);
  const confirmSuccess = !isConfirmEmpty && isPasswordSame && isPasswordFormatValid;

  // 전체 회원가입 유효성 조건
  const isMatch =
    isPasswordValid &&
    password !== "" &&
    password === confirmPassword &&
    isVerified &&
    isNicknameAvailable.color === "success" &&
    name.trim() !== "" &&
    nickname.trim() !== "";

  // 2. 타이머 Effect
  useEffect(() => {
    if (isSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // 메모리 누수 방지
    } else if (timeLeft === 0) {
      setIsSent(false); // 시간 만료 시 상태 리셋하여 재전송 가능하도록 처리
    }
  }, [isSent, timeLeft]);

  // 3. 닉네임 중복검사 디바운스 Effect
  useEffect(() => {
    if (nickname.length < 2) {
      if (nickname.length > 0) {
        setIsNicknameAvailable({ message: "닉네임은 2글자 이상 입력해주세요.", color: "error" });
      } else {
        setIsNicknameAvailable({ message: "", color: "error" });
      }
      return;
    }

    const timer = setTimeout(() => {
      checkNicknameAvailability(nickname);
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timer); // 타이머 초기화 (연타 방지)
  }, [nickname]);

  // 4. 닉네임 중복검사 API
  const checkNicknameAvailability = async (targetNickname) => {
    try {
      const response = await API.get("/api/user/check-nickname", {
        params: {
          nickname: targetNickname,
        },
      });
      const isAvailable = response.data;
      if (isAvailable) {
        setIsNicknameAvailable({ message: "사용 가능한 닉네임입니다.", color: "success" });
      } else {
        setIsNicknameAvailable({ message: "이미 사용 중인 닉네임입니다.", color: "error" });
      }
    } catch (error) {
      console.error(error);
      setIsNicknameAvailable({ message: "검증 중 오류가 발생했습니다.", color: "error" });
    }
  };

  // 5. 타이머 포맷 변환
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 6. 이메일 인증번호 발송 API
  const handleSendMail = async () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const response = await API.post("/api/user/email-verification", {
        email: email,
      });
      if (response.status === 200) {
        setIsSent(true);
        setTimeLeft(180);
        alert("인증번호가 발송되었습니다. 메일함을 확인해주세요!");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        alert(error.response.data); // 예: "이미 사용중인 이메일입니다."
      } else {
        alert("서버와 통신할 수 없습니다.");
      }
    }
  };

  // 7. 이메일 인증코드 확인 API
  const handleSendAuthCode = async () => {
    if (!authCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    try {
      const response = await API.post("/api/user/email-confirmation", {
        email: email,
        code: authCode, // 사용자가 입력한 인증번호
      });
      if (response.status === 200) {
        setIsVerified(true);
        alert("인증에 성공했습니다!");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "인증번호가 틀렸거나 만료되었습니다.");
    }
  };

  // 8. 회원정보 제출(회원가입)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || name.length > 13) {
      alert("이름은 비어있을 수 없으며 13자 이하로 입력해주세요.");
      return;
    }
    if (!nickname.trim() || nickname.length > 13) {
      alert("닉네임은 비어있을 수 없으며 13자 이하로 입력해주세요.");
      return;
    }
    if (!isMatch) {
      alert("모든 입력란을 올바르게 채우고 인증을 완료해주세요.");
      return;
    }

    const signUpData = {
      email: email,
      password: password,
      nickname: nickname,
      name: name,
    };

    console.log(signUpData);
    try {
      const response = await API.post("/api/user/join", signUpData);
      if (response.status === 200) {
        alert("회원가입을 축하드립니다 로그인페이지로 이동됩니다!");
        navigate("/authentication/sign-in"); // 가입 후 로그인 페이지로 비동기 이동
      }
    } catch (error) {
      console.error(error);
      alert("가입 실패: " + (error.response?.data || "서버 에러"));
    }
  };

  // MUI MDInput 스타일 정의 (한글 잘림 방지 및 톤앤매너 최적화)
  const inputStyles = {
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
      "&.Mui-disabled fieldset": {
        borderColor: "rgba(255, 255, 255, 0.08)",
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
      "&.Mui-disabled": {
        color: "rgba(255, 255, 255, 0.3)",
      },
    },
  };

  // 인증 발송/확인 버튼 공통 스타일
  const actionButtonStyles = {
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "10px",
    py: 1.2,
    px: 2.2,
    fontSize: "0.85rem",
    boxShadow: "0 4px 10px rgba(2, 132, 199, 0.15)",
    transition: "all 0.25s ease",
    "&.Mui-disabled": {
      background: "rgba(255, 255, 255, 0.08) !important",
      color: "rgba(255, 255, 255, 0.3) !important",
    },
  };

  return (
    <BasicLayout>
      <Card
        sx={{
          maxWidth: 480,
          mx: "auto",
          mt: 4,
          mb: 6,
          pt: 4,
          pb: 3,
          background: "rgba(15, 23, 42, 0.75)", // slate-900 with high contrast opacity
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          borderRadius: "20px",
        }}
      >
        <MDBox px={4}>
          {/* ===== 로고 영역 ===== */}
          <MDBox display="flex" flexDirection="column" alignItems="center" mb={3} textAlign="center">
            <MDBox mb={1.5}>
              <ContentsMakerLogo />
            </MDBox>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: "-0.5px" }}>
              콘텐츠메이커 스튜디오
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5 }}>
              회원가입 / 콘텐츠 생성 · 예약 · 관리 시작하기
            </MDTypography>
          </MDBox>

          {/* ===== 회원가입 폼 ===== */}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            
            {/* 1. 이메일 입력 및 인증요청 */}
            <MDBox mb={2} display="flex" alignItems="center" gap={1}>
              <MDInput
                type="email"
                label="이메일 주소"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isVerified}
                sx={inputStyles}
              />
              <MDBox display="flex" alignItems="center" gap={1} sx={{ minWidth: "fit-content" }}>
                <MDButton
                  variant="contained"
                  onClick={handleSendMail}
                  disabled={isSent || isVerified}
                  sx={{
                    ...actionButtonStyles,
                    background: "linear-gradient(135deg, #0284c7, #0369a1)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                      boxShadow: "0 6px 12px rgba(2, 132, 199, 0.3)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {isSent ? "재발송" : "인증요청"}
                </MDButton>
              </MDBox>
            </MDBox>

            {/* 2. 인증코드 입력 및 확인 */}
            {isSent && !isVerified && (
              <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                <MDInput
                  type="text"
                  label="인증번호 입력"
                  fullWidth
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  disabled={isVerified}
                  sx={inputStyles}
                />
                <MDTypography variant="button" color="error" fontWeight="bold" sx={{ minWidth: "40px", textAlign: "center" }}>
                  {formatTime(timeLeft)}
                </MDTypography>
                <MDButton
                  variant="contained"
                  onClick={handleSendAuthCode}
                  disabled={isVerified}
                  sx={{
                    ...actionButtonStyles,
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #34d399, #10b981)",
                      boxShadow: "0 6px 12px rgba(16, 185, 129, 0.3)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  인증확인
                </MDButton>
              </MDBox>
            )}

            {/* 이메일 인증 완료 메시지 */}
            {isVerified && (
              <MDTypography variant="caption" color="success" fontWeight="bold" sx={{ ml: 1, mb: 2, display: "block" }}>
                ✓ 이메일 인증이 완료되었습니다.
              </MDTypography>
            )}

            {/* 3. 비밀번호 입력 */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="비밀번호"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={inputStyles}
              />
              {passwordError && (
                <MDTypography variant="caption" color="error" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  비밀번호는 영문, 숫자 포함 8자 이상이어야 합니다.
                </MDTypography>
              )}
              {isPasswordFormatValid && (
                <MDTypography variant="caption" color="success" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  사용 가능한 안전한 비밀번호입니다.
                </MDTypography>
              )}
            </MDBox>

            {/* 4. 비밀번호 확인 입력 */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="비밀번호 확인"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={inputStyles}
              />
              {confirmError && (
                <MDTypography variant="caption" color="error" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  비밀번호가 일치하지 않거나 형식이 올바르지 않습니다.
                </MDTypography>
              )}
              {confirmSuccess && (
                <MDTypography variant="caption" color="success" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  비밀번호가 완벽히 일치합니다.
                </MDTypography>
              )}
            </MDBox>

            {/* 5. 이름 입력 */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="이름"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputStyles}
              />
            </MDBox>

            {/* 6. 닉네임 입력 */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="닉네임"
                fullWidth
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                sx={{
                  ...inputStyles,
                  "& .MuiOutlinedInput-root": {
                    ...inputStyles["& .MuiOutlinedInput-root"],
                    "& fieldset": {
                      borderColor: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" && nickname.length > 0 ? "#10b981" : "rgba(255, 255, 255, 0.15)"),
                    },
                    "&:hover fieldset": {
                      borderColor: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" && nickname.length > 0 ? "#10b981" : "rgba(255, 255, 255, 0.35)"),
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" && nickname.length > 0 ? "#10b981" : "#38bdf8"),
                    },
                  },
                  "& .MuiInputLabel-root": {
                    ...inputStyles["& .MuiInputLabel-root"],
                    color: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" && nickname.length > 0 ? "#10b981" : "rgba(255, 255, 255, 0.5)"),
                    "&.Mui-focused": {
                      color: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" && nickname.length > 0 ? "#10b981" : "#38bdf8"),
                    },
                  },
                }}
              />
              {nickname && (
                <MDTypography variant="caption" color={isNicknameAvailable.color} fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  {isNicknameAvailable.message}
                </MDTypography>
              )}
            </MDBox>

            {/* ===== 회원가입 완료 제출 버튼 ===== */}
            <MDBox mt={3} mb={1}>
              <MDButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isMatch}
                sx={{
                  background: "linear-gradient(135deg, #0284c7, #0369a1)",
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
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255, 255, 255, 0.08) !important",
                    color: "rgba(255, 255, 255, 0.3) !important",
                  },
                }}
              >
                회원가입
              </MDButton>
            </MDBox>

            {/* ===== 로그인 페이지로 리다이렉트 링크 ===== */}
            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>
                이미 계정이 있으신가요?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  sx={{
                    color: "#f43f5e", // Rose pink matching sign-in screen
                    fontWeight: "bold",
                    transition: "color 0.2s",
                    "&:hover": { color: "#fb7185" },
                  }}
                >
                  로그인
                </MDTypography>
              </MDTypography>
            </MDBox>

          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Cover;
