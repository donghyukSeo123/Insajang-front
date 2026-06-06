import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import API from "utils/api";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Overview() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    nickname: "",
    email: ""
  });

  // 비밀번호 상태 관리
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 알림 토글 상태 관리
  const [emailOnPublish, setEmailOnPublish] = useState(true);

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get("/api/user/me");
        const data = response.data;
        setUserInfo({
          name: data.name || "",
          nickname: data.nickname || "게스트",
          email: data.email || "portfolio-guest@insajang.com"
        });
        setEmailOnPublish(data.emailOnPublish !== false);
      } catch (err) {
        console.error("회원 정보를 불러오는 데 실패했습니다.", err);
      }
    };
    fetchUserData();
  }, []);

  const userName = userInfo.nickname || userInfo.name || "게스트";
  const userEmail = userInfo.email || "portfolio-guest@insajang.com";

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("모든 비밀번호 필드를 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    
    try {
      await API.post("/api/user/change-password", {
        currentPassword,
        newPassword
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      alert(msg);
    }
  };

  const handleNotificationToggle = async () => {
    const newValue = !emailOnPublish;
    setEmailOnPublish(newValue);
    try {
      await API.post("/api/user/update-settings", {
        emailOnPublish: newValue
      });
    } catch (err) {
      console.error("알림 설정 저장 실패", err);
      setEmailOnPublish(!newValue); // 롤백
      alert("설정 저장에 실패했습니다.");
    }
  };

  // MUI MDInput 스타일 정의 (한글 잘림 방지 및 톤앤매너 최적화)
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.15)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.3)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4f46e5",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px !important",
      lineHeight: "1.5 !important",
      fontSize: "0.95rem !important",
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.9rem",
      lineHeight: "1.4 !important",
      transform: "translate(14px, 12px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -6px) scale(0.75)",
      },
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: "24px", border: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}>
              <MDBox p={5}>
                {/* 헤더 */}
                <MDBox mb={4}>
                  <MDTypography variant="h4" fontWeight="bold" color="dark">
                    👤 마이페이지 & 계정 설정
                  </MDTypography>
                  <MDTypography variant="button" color="text" sx={{ mt: 0.5, display: "block" }}>
                    가입된 회원 정보 조회와 비밀번호 수정, 메일 수신 정책 및 AI 말투 설정을 관리합니다.
                  </MDTypography>
                </MDBox>

                {/* 1. 회원 기본 정보 */}
                <MDBox mb={4}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                    📂 회원 기본 정보
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MDBox sx={{ backgroundColor: "#fcfcfd", p: 2, borderRadius: "12px", border: "1px solid #f0f2f5" }}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" sx={{ display: "block", mb: 0.5 }}>
                          사용자 닉네임 (이름)
                        </MDTypography>
                        <MDTypography variant="body1" fontWeight="bold" color="dark">
                          {userName}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDBox sx={{ backgroundColor: "#fcfcfd", p: 2, borderRadius: "12px", border: "1px solid #f0f2f5" }}>
                        <MDTypography variant="caption" fontWeight="bold" color="text" sx={{ display: "block", mb: 0.5 }}>
                          로그인 이메일 계정
                        </MDTypography>
                        <MDTypography variant="body1" fontWeight="bold" color="dark">
                          {userEmail}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>

                <Divider sx={{ my: 4 }} />

                {/* 2. 비밀번호 변경 */}
                <MDBox mb={4} component="form" onSubmit={handlePasswordChange}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                    🔒 비밀번호 수정
                  </MDTypography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <MDInput
                        type="password"
                        label="현재 비밀번호"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        sx={inputStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="password"
                        label="새 비밀번호"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={inputStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDInput
                        type="password"
                        label="새 비밀번호 확인"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={inputStyles}
                      />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                      <MDButton
                        type="submit"
                        variant="gradient"
                        color="info"
                        sx={{ borderRadius: "10px", px: 4, py: 1 }}
                      >
                        비밀번호 저장
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>

                <Divider sx={{ my: 4 }} />

                {/* 3. 알림 서비스 설정 */}
                <MDBox mb={4}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                    🔔 알림 메일 수신 설정
                  </MDTypography>
                  
                  <MDBox display="flex" alignItems="center" justifyContent="space-between" py={1.5}>
                    <MDBox>
                      <MDTypography variant="body2" fontWeight="bold" color="dark">
                        예약 발행 알림 메일 수신
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        네이버 블로그 및 인스타그램의 예약 발행 시간이 도달하면 등록된 이메일 계정으로 즉시 발행 알림 메일을 수신합니다.
                      </MDTypography>
                    </MDBox>
                    <Switch 
                      checked={emailOnPublish} 
                      onChange={handleNotificationToggle} 
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#4caf50 !important",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
                          borderColor: "#4caf50 !important",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#4caf50 !important",
                          borderColor: "#4caf50 !important",
                          opacity: "1 !important",
                        },
                      }}
                    />
                  </MDBox>
                </MDBox>



              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
