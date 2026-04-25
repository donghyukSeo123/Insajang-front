/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

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


  const [treeData, setTreeData] = useState([]); // 1. 트리 데이터 상태를 부모로 이동

  // 2. 트리 로드 함수를 부모로 이동
  const getTreeStructure = async () => {
    try {
      const response = await API.get("/api/contents/selectContentsTree");
      setTreeData(response.data);
    } catch (error) {
      console.error("트리 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getTreeStructure();
  }, []);

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
    // API 유틸을 사용하여 수정 요청 (PATCH는 부분 수정에 적합)
    const response = await API.patch(`/api/contents/update/${contentId}`, updatedFields);

    if (response.status === 200 || response.data.success) {
      alert("성공적으로 수정되었습니다.");
      getTreeStructure();
    }
  } catch (error) {
    console.error("수정 중 오류 발생:", error);
    // 유틸리티에서 에러 처리를 공통으로 하지 않는 경우 여기서 처리
    alert(error.response?.data?.message || "수정에 실패했습니다.");
  }
};

  // 2. 삭제 핸들러: API 호출로 데이터를 삭제함
  const handleDelete = async (contentId) => {// 1. 삭제 확인 컨펌 (물리 삭제이므로 필수!)
  if (!window.confirm("정말로 삭제하시겠습니까? 삭제 후에는 복구가 불가능합니다.")) {
    return;
  }

  try {
    // 2. API 호출
    const response = await API.delete(`/api/contents/${contentId}`);
    console.log("삭제 성공:", response);

    // 3. 사용자 알림
    alert("삭제 완료되었습니다.");

    // 4. 후속 작업: 모달 닫기 및 목록 갱신
    // handleCloseModal: 현재 모달을 닫는 상태 관리 함수
    // fetchContentTree: 트리 구조 데이터를 다시 불러오는 함수
     setIsDetailModalOpen(false);
     setSelectedContentData(null);
     getTreeStructure();

  } catch (error) {
    console.error("삭제 실패:", error);
    alert("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
              onOpenModal={() => setIsAddModalOpen(true)} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {/* 트리 데이터와 새로고침 함수를 Props로 전달 */}
            <ContentTree 
              treeData={treeData} 
              onContentClick={handleOpenDetail} 
            />
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