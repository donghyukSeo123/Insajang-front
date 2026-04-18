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

import API from "utils/api";

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 1. 등록 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 2. 상세 모달 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  // 상세 모달에 뿌려줄 실제 DB 데이터 객체 저장용
  const [selectedContentData, setSelectedContentData] = useState(null);

  // 트리에서 아이템 클릭 시 실행될 함수
  const handleOpenDetail = async (contentId) => {
    try {
      // 1. DB에서 상세 데이터 가져오기
      // 엔드포인트는 백엔드 설계에 맞춰 수정하세요 (예: /api/contents/detail/123)
      const response = await API.get(`/api/contents/detail/${contentId}`);
      

      console.log(response);
      // 2. 가져온 데이터를 상태에 저장
      setSelectedContentData(response.data);
      
      // 3. 모달 열기
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("상세 데이터 로딩 실패:", error);
      alert("데이터를 불러오지 못했습니다.");
    }
  };


  // 1. 수정 핸들러: API 호출로 DB를 업데이트하고 목록을 갱신함
  const handleUpdate = async (contentId, updatedFields) => {
    try {
      // API 호출 예시: await axios.put(`/api/contents/${id}`, updatedFields);
      console.log("수정할 ID:", contentId);
      console.log("수정된 내용:", updatedFields);
      
      alert("성공적으로 수정되었습니다.");
      // 여기서 목록 데이터를 다시 불러오는 함수(fetchData 등)를 호출하면 좋습니다.
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 2. 삭제 핸들러: API 호출로 데이터를 삭제함
  const handleDelete = async (contentId) => {
    try {
      // API 호출 예시: await axios.delete(`/api/contents/${id}`);
      console.log("삭제할 ID:", contentId);
      
      alert("삭제 완료되었습니다.");
      // 여기서도 목록 데이터를 다시 불러오거나 상태에서 제거해야 합니다.
    } catch (error) {
      console.error("삭제 실패:", error);
    }
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
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContentData(null); // 닫을 때 데이터 초기화 (선택사항)
        }} 
        data={selectedContentData} 
        onUpdate={handleUpdate}  // 수정 함수 전달
        onDelete={handleDelete}  // 삭제 함수 전달
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;