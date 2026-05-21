/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DashboardNavbar() {
  const [userName, setUserName] = useState("사용자");

  useEffect(() => {
    // 세션 스토리지에서 이름 가져오기
    console.log('유저명: ' + localStorage.getItem("userName"))
    const savedName = localStorage.getItem("userName") || localStorage.getItem("name");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogout = () => {

      const isConfirmed = window.confirm("정말 로그아웃하시겠습니까?");
      
      if (isConfirmed) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        window.location.href = "/login";
      } else {
        window.history.back();
      }

    return null; // 화면은 안 보여줘도 되니까요!
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        background: "transparent !important",
        boxShadow: "none !important",
        border: "none !important",
        mt: 1,
        mb: 2,
      }}
    >
      <Toolbar 
        sx={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          minHeight: "40px !important", 
          px: 3 
        }}
      >
        {/* 우측 상단 유저 인포 영역 */}
        <MDBox display="flex" alignItems="center" gap={1.5}>
          
          {/* 유저 이름 표시 */}
          <MDBox display="flex" alignItems="center" gap={0.5}>
            <Icon sx={{ color: "#7b809a", fontSize: "1.1rem !important" }}>account_circle</Icon>
            <MDTypography variant="button" fontWeight="medium" color="text">
              <span style={{ color: "#344767", fontWeight: "600" }}>{userName}</span>님
            </MDTypography>
          </MDBox>

          {/* 구별 세로선 */}
          <MDBox width="1px" height="12px" bgcolor="#d2d6da" />

          {/* 로그아웃 버튼 */}
          <MDBox 
            component="span" 
            onClick={handleLogout}
            sx={{ 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", // [교정] '=' 대신 ':' 문법으로 정상 수정 완료
              gap: 0.3,
              "&:hover p": { color: "#e91e63 !important" }
            }}
          >
            <MDTypography variant="button" fontWeight="regular" sx={{ fontSize: "0.85rem", color: "#7b809a" }}>
              로그아웃
            </MDTypography>
          </MDBox>

        </MDBox>
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;