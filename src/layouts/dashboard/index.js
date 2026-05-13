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
  const [currentRange, setCurrentRange] = useState({ start: null, end: null });
  const [treeData, setTreeData] = useState([]);

  // 1. 달력에 그려질 이벤트 상태
  const [events, setEvents] = useState([]);
  
  // 2. 드롭된 컨텐츠 임시 저장 (모달 전달용)
  const [droppedInfo, setDroppedInfo] = useState(null);

  /**
   * 트리 구조 로딩 (콘텐츠 목록)
   */
  const getTreeStructure = async () => {
    try {
      const response = await API.get("/api/contents/selectContentsTree");
      setTreeData(response.data);
    } catch (error) {
      console.error("트리 로딩 실패:", error);
    }
  };

  /**
 * 3. [수정] 현재 화면에 보이는 기간의 일정만 가져오기
 */
  const getSchedules = async (start, end) => {
    
  // 인자가 없으면 저장된 범위를 사용하도록 보완
  const startDate = start || currentRange.start;
  const endDate = end || currentRange.end;

  if (!startDate || !endDate) return;

    try {
      // API 호출 시 시작일과 종료일을 쿼리 파라미터로 전달
      const response = await API.get("/api/contents/schedules", {
        params: { start : startDate, end : endDate }
      }); 
      
      console.log(response.data);

      const formattedEvents = response.data.map((item) => ({
        contentId: item.contentId,
        title: item.title,
        start: item.scheduledAt,
        allDay: false,
        backgroundColor: item.status === "PUBLISHED" ? "#4CAF50" : "#FB8C00",
        extendedProps: { ...item }
      }));

    console.log("FullCalendar로 변환된 데이터:", formattedEvents);

    console.log(formattedEvents.map(e => e.id));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("일정 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getTreeStructure();
  }, []);

  /**
   * 4. 외부 트리에서 날짜 위로 드롭했을 때 핸들러
   */
  const handleExternalDrop = (droppedData) => {
    setSelectedDate(dayjs(droppedData.dateStr));
    setDroppedInfo({
      contentId: droppedData.contentId,
      title: droppedData.title,
    });
    setIsAddModalOpen(true);
  };

  /**
   * 5. 일정 저장 (모달 확인 버튼 클릭 시)
   */
  const handleSaveSchedule = async (finalData) => {
    try {
      const response = await API.post("/api/contents/save-schedule", finalData);
      
      if (response.status === 200) {
        alert("일정이 등록되었습니다.");
        await getSchedules();
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("일정 저장에 실패했습니다.");
    } finally {
      setIsAddModalOpen(false);
      setDroppedInfo(null);
    }
  };

  /**
   * 6. 상세 데이터 열기
   */
  const handleOpenDetail = async (contentId) => {
    try {
      const response = await API.get(`/api/contents/detail/${contentId}`);
      setSelectedContentData(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("상세 데이터 로딩 실패:", error);
    }
  };

  /**
   * 7. 달력 내 이벤트를 직접 클릭했을 때 상세 보기 연결
   */
  const handleEventClick = (info) => {
    console.log(info.extendedProps.contentId);
    const contentId = info.extendedProps.contentId;
    handleOpenDetail(contentId);
  };

  /**
   * 8. 데이터 수정 핸들러
   */
  const handleUpdate = async (contentId, updatedFields) => {
    try {
      const response = await API.patch(`/api/contents/update/${contentId}`, updatedFields);
      if (response.status === 200) {
        alert("성공적으로 수정되었습니다.");
        getTreeStructure(); // 트리 갱신
        getSchedules();     // 달력 갱신
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error("수정 오류:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  /**
   * 9. 데이터 삭제 핸들러
   */
  const handleDelete = async (contentId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await API.delete(`/api/contents/${contentId}`);
      alert("삭제 완료되었습니다.");
      setIsDetailModalOpen(false);
      getTreeStructure(); // 트리 갱신
      getSchedules();     // 달력 갱신
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ContentCalendar 
              events={events} 
              value={selectedDate} 
              onChange={setSelectedDate} 
              onEventClick={handleEventClick}
              onRangeChange={(start, end) => {
                setCurrentRange({ start, end }); // 범위 기억해두기
                getSchedules(start, end);       // 호출
              }}
              onOpenModal={(date) => {
                if (date) setSelectedDate(dayjs(date));
                setDroppedInfo(null);
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
          setDroppedInfo(null);
        }} 
        selectedDate={selectedDate} 
        droppedContent={droppedInfo} 
        onSave={handleSaveSchedule} 
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