/* eslint-disable no-unused-vars */
import { useState } from "react";

// @mui material components (Grid 등)
import Grid from "@mui/material/Grid";

// 날짜 관련 (dayjs)
import dayjs from "dayjs";

// Material Dashboard 2 React components (MDBox 등)
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components (Layout, Navbar, Footer 등)
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// 직접 만든 대시보드 전용 컴포넌트들
import ContentCalendar from "./components/ContentCalendar";
import ContentTree from "./components/ContentTree";
import ScheduleModal from "./components/ScheduleModal";
import ContentDetailModal from "./components/ContentDetailModal";

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 1. 등록 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 2. 상세 모달 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  const handleOpenDetail = (name) => {
    setSelectedContent(name);
    setIsDetailModalOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ContentCalendar 
              value={selectedDate} 
              onChange={setSelectedDate} 
              onOpenModal={() => setIsAddModalOpen(true)} // 등록 모달 연결
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ContentTree onContentClick={handleOpenDetail} /> {/* 상세 모달 연결 */}
          </Grid>
        </Grid>
      </MDBox>

      {/* 등록 모달 */}
      <ScheduleModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        selectedDate={selectedDate} 
      />

      {/* 상세 모달 */}
      <ContentDetailModal 
        open={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        contentName={selectedContent} 
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;