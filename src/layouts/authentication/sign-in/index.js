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

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import signInLogo from "assets/images/logos/sign_in_logo.png";

function Basic() {
  const navigate = useNavigate();

  // 1. 제어 컴포넌트 객체화
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

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
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        localStorage.setItem("username", JSON.stringify(response.data.userName));
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert(error.response?.data || "로그인 정보를 다시 확인해주세요.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card
        sx={{
          maxWidth: 460,
          mx: "auto",
          mt: 8,
          pt: 5,
          pb: 3,
        }}
      >
        <MDBox px={3}>
          {/* ===== 로고 영역 ===== */}
          <MDBox display="flex" flexDirection="column" alignItems="center" mb={4}>
            <MDBox
              component="img"
              src={signInLogo}
              alt="로고"
              sx={{
                width: 88,
                height: "auto",
                mb: 1.5,
              }}
            />
            <MDTypography variant="h5" fontWeight="bold">
              콘텐츠메이커 스튜디오
            </MDTypography>
            <MDTypography variant="caption" color="text">
              자동 콘텐츠 생성 · 예약 · 관리
            </MDTypography>
          </MDBox>

          {/* ===== 로그인 폼 ===== */}
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <MDBox mb={2}>
              <MDInput
                name="email"
                type="email"
                label="이메일"
                fullWidth
                variant="outlined"
                size="small"
                value={values.email}
                onChange={handleChange}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                name="password"
                type="password"
                label="비밀번호"
                fullWidth
                variant="outlined"
                size="small"
                value={values.password}
                onChange={handleChange}
              />
            </MDBox>

            {/* 로그인 유지 & 찾기 링크 분리 배치 */}
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  로그인 유지
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" alignItems="center">
                <MDTypography
                  variant="button"
                  color="info"
                  fontWeight="regular"
                  sx={{ cursor: "pointer" }}
                  onClick={() => alert("준비 중인 기능입니다.")}
                >
                  아이디 찾기
                </MDTypography>
                <MDTypography variant="button" color="secondary" sx={{ mx: 0.5 }}>
                  |
                </MDTypography>
                <MDTypography
                  variant="button"
                  color="info"
                  fontWeight="regular"
                  sx={{ cursor: "pointer" }}
                  onClick={() => alert("준비 중인 기능입니다.")}
                >
                  비밀번호 찾기
                </MDTypography>
              </MDBox>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                로그인
              </MDButton>
            </MDBox>

            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                계정이 없으신가요?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
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