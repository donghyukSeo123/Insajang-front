/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ContentCalendar from "./components/ContentCalendar";
import ContentTree from "./components/ContentTree";
import ScheduleModal from "./components/ScheduleModal";
import ContentDetailModal from "./components/ContentDetailModal";

import API from "utils/api";

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContentData, setSelectedContentData] = useState(null);
  const [treeData, setTreeData] = useState([]);

  // 1. [추가] 실제 달력에 그려질 이벤트 상태
  const [events, setEvents] = useState([]);
  
  // 2. [추가] 드롭된 컨텐츠 임시 저장 (모달 전달용)
  const [droppedInfo, setDroppedInfo] = useState(null);

  const getTreeStructure = async () => {
    try {
      const response = await API.get("/api/contents/selectContentsTree");
      setTreeData(response.data);
    } catch (error) {
      console.error("트리 로딩 실패:", error);
    }
  };

  // 3. [추가] 서버에서 등록된 일정(이벤트) 가져오기
  const getSchedules = async () => {
    try {
      const response = await API.get("/api/schedules"); // 실제 API 엔드포인트에 맞게 수정
      setEvents(response.data);
    } catch (error) {
      console.error("일정 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getTreeStructure();
    getSchedules(); // 초기 로드 시 일정 가져오기
  }, []);

  // 4. [수정] 드래그 앤 드롭 핸들러
  const handleExternalDrop = (droppedData) => {
    // 드롭 시점에 이벤트를 생성하지 않고, 정보만 저장한 뒤 모달을 엽니다.
    setSelectedDate(dayjs(droppedData.dateStr));
    setDroppedInfo({
      contentId: droppedData.contentId,
      title: droppedData.title,
    });
    setIsAddModalOpen(true);
  };

  // 5. [추가] 모달에서 '저장' 버튼을 눌렀을 때만 실행되는 함수
  const handleSaveSchedule = async (finalData) => {
    try {
      // 서버 저장 API 호출
      const response = await API.post("/api/contents/save-schedule", finalData);
      
      if (response.status === 200) {
        alert("일정이 등록되었습니다.");
        // 저장 성공 시에만 달력 이벤트를 갱신합니다.
        getSchedules(); 
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("일정 저장에 실패했습니다.");
    } finally {
      setIsAddModalOpen(false);
      setDroppedInfo(null);
    }
  };

  const handleOpenDetail = async (contentId) => {
    try {
      const response = await API.get(`/api/contents/detail/${contentId}`);
      setSelectedContentData(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("상세 데이터 로딩 실패:", error);
    }
  };

  const handleUpdate = async (contentId, updatedFields) => {
    try {
      const response = await API.patch(`/api/contents/update/${contentId}`, updatedFields);
      if (response.status === 200) {
        alert("성공적으로 수정되었습니다.");
        getTreeStructure();
        getSchedules(); // 수정 후 달력 갱신
      }
    } catch (error) {
      console.error("수정 오류:", error);
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await API.delete(`/api/contents/${contentId}`);
      alert("삭제 완료되었습니다.");
      setIsDetailModalOpen(false);
      getTreeStructure();
      getSchedules(); // 삭제 후 달력 갱신
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
              // [수정] 이제 상태값인 events를 넘깁니다.
              events={events} 
              value={selectedDate} 
              onChange={setSelectedDate} 
              onOpenModal={(date) => {
                if (date) setSelectedDate(dayjs(date));
                setDroppedInfo(null); // 직접 추가 시에는 드롭 정보 초기화
                setIsAddModalOpen(true);
              }} 
              onExternalDrop={handleExternalDrop} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
        onClose={() => {
          setIsAddModalOpen(false);
          setDroppedInfo(null); // 취소 시 임시 데이터 삭제
        }} 
        selectedDate={selectedDate} 
        droppedContent={droppedInfo} // 드롭된 정보 전달
        onSave={handleSaveSchedule} // [추가] 저장 핸들러 연결
      />

      {/* 상세 모달 */}
      <ContentDetailModal 
        open={isDetailModalOpen} 
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContentData(null);
        }} 
        data={selectedContentData} 
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;