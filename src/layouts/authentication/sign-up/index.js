import { useState, useEffect} from "react"; // 

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import API from "utils/api";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

function Cover() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSent, setIsSent] = useState(false); // 메일 발송 여부
  const [isVerified, setIsVerified] = useState(false); // 메일인증 여부
  const [isNicknameAvailable, setIsNicknameAvailable] = useState({message: "", color: "error"}); // 메일인증 여부
  const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)
  const [email, setEmail] = useState(""); // 이메일 입력값 상태
  const [name, setName] = useState(""); // 이름
  const [nickname, setNickname] = useState(""); // 이름
  const [authCode, setAuthCode] = useState(""); // 인증코드 입력상태

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;// 비밀번호 형식이 맞는지 (8자 이상, 영문/숫자)
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordFormatValid = passwordRegex.test(password); // 형식 통과 여부
  const isPasswordEmpty = password === ""; //비밀번호비어있음
  const isConfirmEmpty = confirmPassword === "";  //비밀번호확인란 비어있음
  const isPasswordSame = password === confirmPassword; // 일치 여부
  const passwordError = !isPasswordEmpty && !isPasswordFormatValid; //패스워드 에러
  const confirmError = !isConfirmEmpty && (!isPasswordSame || !isPasswordFormatValid); //일치여부에러
  const confirmSuccess = !isConfirmEmpty && isPasswordSame && isPasswordFormatValid; //비밀번호사용가능여부

  // 비밀번호 확인 칸 에러 여부 (비어있지 않은데 형식이 틀렸거나, 서로 다를 때)
  const isError = (password !== "" && !isPasswordValid) || 
                  (confirmPassword !== "" && password !== confirmPassword);
  // 모든 조건 충족 (형식도 맞고, 두 값도 일치함)
  const isMatch = isPasswordValid && password !== "" && password === confirmPassword && isVerified && isNicknameAvailable.color === "success"; 
  
  // 타이머 로직
  useEffect(() => {
    if (isSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // 메모리 누수 방지
    } else if (timeLeft === 0) {
      setIsSent(false); // 시간 다 되면 다시 발송 가능하게 상태 변경
    }
  }, [isSent, timeLeft]);

  // 1. 디바운싱 로직: 입력 후 500ms 대기
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nickname.length >= 2) {
        checkNicknameAvailability(nickname);
      } else {
        setIsNicknameAvailable({ message: "닉네임은 2글자이상 입력해주세요", color: "error" });
      }
    }, 500);

    return () => clearTimeout(timer); // 타이머 초기화 (연타 방지)
  }, [nickname]);

  // 2. 서버 검증 함수 (예시)
  const checkNicknameAvailability = async (name) => {
    try {
      
      const response = await API.get("/api/user/check-nickname", {
          params: { 
            nickname: nickname 
          }
      });

      console.log(response);
      const isAvailable = response.data;

      if (isAvailable) {
        setIsNicknameAvailable({ message: "사용 가능한 닉네임입니다.", color: "success" });
      } else {
        setIsNicknameAvailable({ message: "이미 사용 중인 닉네임입니다.", color: "error" });
      }
    } catch (error) {
      setIsNicknameAvailable({ message: "검증 중 오류가 발생했습니다.", color: "error" });
    }
  };

  // 초를 분:초 형식으로 변환
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };
  
  //인증메일발송
  const handleSendMail = async () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }

    try {

      const response = await API.post("/api/user/email-verification", {
        email: email 
      });
      
      if (response.status === 200) {
        setIsSent(true);
        setTimeLeft(180);
        alert("인증번호가 발송되었습니다. 메일함을 확인해주세요!");
      }

    } catch (error) {
      if (error.response) {
        alert(error.response.data); // "이미 사용중인 이메일입니다."
      } else {
        alert("서버와 통신할 수 없습니다.");
      }
    }
  };
  
  //인증코드 확인
  const handleSendAuthCode = async () => {
    if (!authCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await API.post("/api/user/email-confirmation", {
        email: email, // state에 저장된 이메일
        code: authCode, // 사용자가 입력한 인증번호
      });

      if (response.status === 200) {
        alert("인증에 성공했습니다!");
        setIsVerified(true); 
      }
    } catch (error) {
      console.error("인증 실패:", error);
      alert(error.response?.data || "인증번호가 틀렸거나 만료되었습니다.");
    }
  };

  //회원정보 제출(회원가입)
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // 1. 유효성 검사 (Validation)
    if (!name.trim() || name.length > 13) {
      alert("이름은 비어있을 수 없으며 13자 이하로 입력해주세요.");
      return;
    }
    
    if (!nickname.trim() || nickname.length > 13) {
      alert("닉네임은 비어있을 수 없으며 13자 이하로 입력해주세요.");
      return;
    }

    // 폼 데이터 준비 (DB 컬럼 기반)
    const signUpData = {
      email: email,
      password: password, 
      nickname: nickname,
      name: name,          
      role: "USER"        
    };
    
    console.log(signUpData);
    
    try {
      const response = await API.post("/api/user/join", signUpData);
      
      if (response.status === 200) {
        alert("회원가입을 축하드립니다 로그인페이지로 이동됩니다!");
        navigate("/authentication/sign-in"); // 가입 후 로그인 페이지로 비동기 이동
      }
    } catch (error) {
      alert("가입 실패: " + (error.response?.data || "서버 에러"));
    }
  };

  return (
    <BasicLayout>
      <Card
        sx={{
          maxWidth: 460,
          mx: "auto",
          mt: 4,
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
          <MDBox display="flex" flexDirection="column" alignItems="center" mb={3} textAlign="center">
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: "-0.5px" }}>
              회원가입
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5 }}>
              콘텐츠 자동 생성 · 예약 · 관리 시작하기
            </MDTypography>
          </MDBox>

          <MDBox component="form" role="form">
            <MDBox mb={2} display="flex" alignItems="center" gap={1}>
              {/* 이메일 입력창 */}
              <MDBox sx={{ flex: 1 }}>
                <MDInput
                  type="email"
                  label="이메일 주소"
                  variant="outlined"
                  fullWidth
                  value={email} 
                  disabled={isVerified}
                  onChange={(e) => setEmail(e.target.value)} 
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                      "&.Mui-focused fieldset": { borderColor: "#38bdf8" }
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 14px !important",
                      lineHeight: "1.5 !important",
                      fontSize: "0.95rem !important"
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.9rem",
                      lineHeight: "1.4 !important",
                      transform: "translate(14px, 12px) scale(1)",
                      "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                      "&.Mui-focused": { color: "#38bdf8" }
                    }
                  }}
                />
              </MDBox>
              
              {/* 인증 버튼 & 타이머 묶음 */}
              <MDBox display="flex" alignItems="center" gap={1} sx={{ minWidth: "fit-content" }}>
                <MDButton 
                  variant="contained" 
                  disabled={isSent || isVerified}
                  onClick={handleSendMail}
                  sx={{ 
                    height: "40px", 
                    whiteSpace: "nowrap", 
                    borderRadius: "10px",
                    background: isSent ? "rgba(255, 255, 255, 0.1)" : "linear-gradient(135deg, #0284c7, #0369a1)",
                    color: isSent ? "rgba(255,255,255,0.4)" : "#fff",
                    boxShadow: isSent ? "none" : "0 4px 12px rgba(2, 132, 199, 0.2)",
                    "&:hover": {
                      background: isSent ? "rgba(255, 255, 255, 0.1)" : "linear-gradient(135deg, #0ea5e9, #0284c7)"
                    }
                  }}
                >
                  {isSent ? "발송완료" : "인증요청"}
                </MDButton>
                
                {/* 타이머 */}
                {isSent && !isVerified && (
                  <MDTypography 
                    variant="caption" 
                    color="error" 
                    fontWeight="bold" 
                    sx={{ minWidth: "35px", textAlign: "center" }}
                  >
                    {formatTime(timeLeft)}
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
            
            {isSent && (
                <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                  <MDInput
                    type="text"
                    label="인증번호 입력"
                    variant="outlined"
                    fullWidth
                    value={authCode}
                    disabled={isVerified}
                    onChange={(e) => setAuthCode(e.target.value)} 
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "10px",
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                        "&.Mui-focused fieldset": { borderColor: "#38bdf8" }
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 14px !important",
                        lineHeight: "1.5 !important",
                        fontSize: "0.95rem !important"
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.9rem",
                        lineHeight: "1.4 !important",
                        transform: "translate(14px, 12px) scale(1)",
                        "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                        "&.Mui-focused": { color: "#38bdf8" }
                      }
                    }}
                  />
                  <MDButton 
                    variant="contained"
                    onClick={handleSendAuthCode}
                    disabled={isVerified}
                    sx={{ 
                      height: "40px",
                      whiteSpace: "nowrap", 
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #10b981, #059669)", // clean green
                      color: "#fff",
                      px: 2.5,
                      "&:hover": {
                        background: "linear-gradient(135deg, #34d399, #10b981)"
                      },
                      "&.Mui-disabled": {
                        background: "rgba(255, 255, 255, 0.1) !important",
                        color: "rgba(255, 255, 255, 0.3) !important"
                      }
                    }}
                  >
                    인증확인
                  </MDButton>
                </MDBox>
              )}

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="비밀번호"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                    "&.Mui-focused fieldset": { borderColor: "#38bdf8" }
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 14px !important",
                    lineHeight: "1.5 !important",
                    fontSize: "0.95rem !important"
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4 !important",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                    "&.Mui-focused": { color: "#38bdf8" }
                  }
                }}
              />
              {!isPasswordFormatValid && !isPasswordEmpty && (
                <MDTypography variant="caption" color="error" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  영문, 숫자 조합 8자 이상으로 설정해주세요.
                </MDTypography>
              )}
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="비밀번호 확인"
                variant="outlined"
                fullWidth
                error={isError}
                success={isMatch}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: isError ? "#f43f5e" : (isMatch ? "#10b981" : "rgba(255, 255, 255, 0.12)") },
                    "&:hover fieldset": { borderColor: isError ? "#f43f5e" : (isMatch ? "#10b981" : "rgba(255, 255, 255, 0.3)") },
                    "&.Mui-focused fieldset": { borderColor: isError ? "#f43f5e" : (isMatch ? "#10b981" : "#38bdf8") }
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 14px !important",
                    lineHeight: "1.5 !important",
                    fontSize: "0.95rem !important"
                  },
                  "& .MuiInputLabel-root": {
                    color: isError ? "#f43f5e" : (isMatch ? "#10b981" : "rgba(255, 255, 255, 0.5)"),
                    fontSize: "0.9rem",
                    lineHeight: "1.4 !important",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                    "&.Mui-focused": { color: isError ? "#f43f5e" : (isMatch ? "#10b981" : "#38bdf8") }
                  }
                }}
              />
              {!isConfirmEmpty && !isPasswordSame && (
                <MDTypography variant="caption" color="error" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  먼저 입력한 비밀번호와 달라요! 다시 확인해주세요.
                </MDTypography>
              )}
              {confirmSuccess && (
                <MDTypography variant="caption" color="success" fontWeight="bold" sx={{ ml: 1, mt: 0.5, display: "block" }}>
                  완벽합니다! 비밀번호가 일치해요.
                </MDTypography>
              )}
            </MDBox>
            
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="사용자 이름"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                    "&.Mui-focused fieldset": { borderColor: "#38bdf8" }
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 14px !important",
                    lineHeight: "1.5 !important",
                    fontSize: "0.95rem !important"
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4 !important",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                    "&.Mui-focused": { color: "#38bdf8" }
                  }
                }}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text" 
                label="사용자 닉네임"
                variant="outlined"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" ? "#10b981" : "rgba(255, 255, 255, 0.12)") },
                    "&:hover fieldset": { borderColor: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" ? "#10b981" : "rgba(255, 255, 255, 0.3)") },
                    "&.Mui-focused fieldset": { borderColor: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" ? "#10b981" : "#38bdf8") }
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 14px !important",
                    lineHeight: "1.5 !important",
                    fontSize: "0.95rem !important"
                  },
                  "& .MuiInputLabel-root": {
                    color: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" ? "#10b981" : "rgba(255, 255, 255, 0.5)"),
                    fontSize: "0.9rem",
                    lineHeight: "1.4 !important",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                    "&.Mui-focused": { color: isNicknameAvailable.color === "error" && nickname.length > 0 ? "#f43f5e" : (isNicknameAvailable.color === "success" ? "#10b981" : "#38bdf8") }
                  }
                }}
              />
              {/* 검증 메시지 출력 */}
              {nickname && (
                <MDBox mt={0.5} ml={1}>
                  <MDTypography variant="caption" color={isNicknameAvailable.color} fontWeight="medium">
                    {isNicknameAvailable.message}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
            
            <MDBox mt={4} mb={1}>
              <MDButton 
                variant="contained" 
                fullWidth
                disabled={!isMatch} // 일치할 때만 버튼 활성화
                onClick={handleSubmit}
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
                    transform: "translateY(-1px)"
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255, 255, 255, 0.08) !important",
                    color: "rgba(255, 255, 255, 0.3) !important",
                    boxShadow: "none"
                  }
                }}
              >
                회원가입
              </MDButton>
            </MDBox>

            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>
                이미 계정이 있으신가요?{" "}
                <MDTypography
                  component={Link}
                  to="/login"
                  variant="button"
                  sx={{ 
                    color: "#38bdf8", 
                    fontWeight: "bold", 
                    transition: "color 0.2s",
                    "&:hover": { color: "#7dd3fc" } 
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

export default Cover;� Input 테두리 색상 변경 (error 속성 지원 시)
                error={isNicknameAvailable.color === "error"}
                success={isNicknameAvailable.color === "success" && nickname.length > 0}
              />
              {/* 검증 메시지 출력 */}
              {nickname && (
                <MDBox mt={0.5} ml={1}>
                  <MDTypography variant="caption" color={isNicknameAvailable.color} fontWeight="medium">
                    {isNicknameAvailable.message}
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>
            
            <MDBox mt={4} mb={1}>
              <MDButton 
                variant="gradient" 
                color="info" 
                fullWidth
                disabled={!isMatch} // 일치할 때만 버튼 활성화
                onClick={handleSubmit}
              >
                회원가입
              </MDButton>
            </MDBox>

            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                이미 계정이 있으신가요?{" "}
                <MDTypography
                  component={Link}
                  to="/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  로그인
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
