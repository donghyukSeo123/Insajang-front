/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function PlatformSettings() {
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(true);
  const [mentionsMe, setMentionsMe] = useState(false);
  const [newLaunches, setNewLaunches] = useState(true);
  const [productUpdate, setProductUpdate] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          알림 및 연동 설정
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          발행 및 메일 서비스
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={followsMe} onChange={() => setFollowsMe(!followsMe)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              네이버 블로그 API 연동 활성화
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={answersPost} onChange={() => setAnswersPost(!answersPost)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              콘텐츠 예약/발행 완료 시 메일 수신
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={mentionsMe} onChange={() => setMentionsMe(!mentionsMe)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              주간 블로그 포스팅 성과 리포트 수신
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={newLaunches} onChange={() => setNewLaunches(!newLaunches)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              AI 이미지 자동 우회 매칭 활성화
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox mt={3}>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            앱 환경 설정
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={productUpdate} onChange={() => setProductUpdate(!productUpdate)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              콘텐츠 자동 생성 완료 브라우저 알림
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={newsletter} onChange={() => setNewsletter(!newsletter)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              스튜디오 신기능 업데이트 소식 알림
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
