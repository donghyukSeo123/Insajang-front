import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function ContentCalendar({ events, onOpenModal, onEventClick, onExternalDrop, onRangeChange}) {
  const calendarRef = useRef(null);
  const [calendarTitle, setCalendarTitle] = useState("");

  // 버튼들 로직: API 호출만 하면 datesSet에서 글자를 바꿔줍니다.
  const handlePrev = () => calendarRef.current.getApi().prev();
  const handleNext = () => calendarRef.current.getApi().next();
  const handleToday = () => calendarRef.current.getApi().today();

  const handleDrop = (info) => {
    const droppedData = {
      contentId: info.draggedEl.getAttribute("data-id"),
      title: info.draggedEl.getAttribute("data-title"),
      color: info.draggedEl.getAttribute("data-color"),
      dateStr: info.dateStr,
      allDay: info.allDay,
    };
    if (onExternalDrop) onExternalDrop(droppedData);
  };

  return (
    <Card 
      sx={{ 
        height: "100%", 
        minHeight: "800px", 
        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
        borderRadius: "24px",
        border: "none"
      }}
    >
      <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox>
          <MDTypography variant="h5" fontWeight="bold">
            콘텐츠 플래닝 캘린더
          </MDTypography>
          <MDBox display="flex" alignItems="center" mt={0.5}>
            <MDButton 
              variant="text" 
              color="dark"
              iconOnly 
              onClick={handlePrev}
            >
              <Icon>chevron_left</Icon>
            </MDButton>
            
            <MDButton 
              variant="text" 
              color="dark"
              sx={{ mx: 1, fontSize: "1.1rem", fontWeight: "bold" }} 
              onClick={handleToday}
            >
              {calendarTitle}
            </MDButton>

            <MDButton 
              variant="text" 
              color="dark"
              iconOnly 
              onClick={handleNext}
            >
              <Icon>chevron_right</Icon>
            </MDButton>
          </MDBox>
        </MDBox>

        {/* 상태 범례 (Legend) */}
        <MDBox display="flex" alignItems="center" gap={2}>
          <MDBox display="flex" alignItems="center" gap={1}>
            <MDBox
              width="10px"
              height="10px"
              borderRadius="50%"
              sx={{ backgroundColor: "#4CAF50" }}
            />
            <MDTypography variant="button" fontWeight="regular" color="text">
              게시완료
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" gap={1}>
            <MDBox
              width="10px"
              height="10px"
              borderRadius="50%"
              sx={{ backgroundColor: "#FB8C00" }}
            />
            <MDTypography variant="button" fontWeight="regular" color="text">
              게시예약
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider sx={{ my: 0 }} />

      <MDBox p={3} sx={{
        "& .fc": { fontFamily: '"Roboto", sans-serif', border: "none" },
        "& .fc-header-toolbar": { display: "none" }, // 기본 헤더는 숨김
        "& .fc-col-header-cell": { padding: "15px 0", backgroundColor: "#f8f9fa", border: "none !important" },
        "& .fc-col-header-cell-cushion": { fontSize: "0.8rem", fontWeight: "700", color: "#7b809a", textDecoration: "none !important" },
        "& .fc-daygrid-day": { border: "1px solid #f0f2f5 !important" },
        "& .fc-daygrid-day-number": { color: "#495057", padding: "10px", fontSize: "0.9rem", fontWeight: "bold" },
        "& .fc-day-other .fc-daygrid-day-number": { color: "#c2c2c2 !important" }, // 타 월 일자
        "& .fc-day-today": { backgroundColor: "rgba(3, 169, 244, 0.08) !important" }, // 오늘 날짜 하늘색 소프트 하이라이팅
        "& .fc-event": { 
          border: "none", 
          borderRadius: "6px", 
          cursor: "pointer",
          fontSize: "0.82rem !important", // 싱글라인에 적합한 가독성 좋은 폰트 크기
          fontWeight: "bold",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
          overflow: "hidden !important",
          textOverflow: "ellipsis !important",
          whiteSpace: "nowrap !important"
        },
        "& .fc-daygrid-block-event": {
          color: "#ffffff !important", // 블록형 이벤트는 항상 흰색 글자
          padding: "3px 6px !important"
        },
        "& .fc-daygrid-dot-event": {
          color: "#344767 !important", // 라인형(점) 이벤트는 진회색 글자
          padding: "4px 6px !important",
          backgroundColor: "transparent !important",
          display: "flex !important",
          flexWrap: "wrap !important", // 자식 요소(시간/제목)의 줄바꿈 배치를 허용
          alignItems: "center",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04) !important"
          }
        },
        "& .fc-event-title": {
          display: "block !important", 
          flexBasis: "100% !important", // 100% 너비를 차지하여 강제 줄바꿈(Time 아래 배치) 유도
          overflow: "hidden !important",
          textOverflow: "ellipsis !important",
          whiteSpace: "nowrap !important",
          fontSize: "0.82rem !important",
          fontWeight: "bold !important",
          marginTop: "2px",
          paddingLeft: "14px !important" // 좌측 점(Dot) 마커 라인과 줄을 맞추기 위한 패딩
        },
        "& .fc-event-time": {
          display: "inline-block !important", 
          fontWeight: "bold",
          fontSize: "0.78rem !important",
          color: "rgba(0, 0, 0, 0.55) !important", // 시간 표시에 최적화된 은은한 서브 텍스트 컬러
          marginRight: "4px"
        }
      }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height="650px"
          events={events}
          eventStartEditable={false}
          titleFormat={{ year: "numeric", month: "long" }}
          
          datesSet={(arg) => {
            setCalendarTitle(arg.view.title);
            if (onRangeChange) {
              onRangeChange(arg.startStr, arg.endStr);
              console.log('시작 :' + arg.startStr);
              console.log('끝 :' + arg.endStr);
            }
          }}

          droppable={true} 
          drop={handleDrop} 
          editable={true}
          eventReceive={(info) => info.revert()}
          eventClick={(info) => onEventClick(info.event)}
          dayMaxEvents={3}
        />
      </MDBox>
    </Card>
  );
}

ContentCalendar.defaultProps = { events: [], onEventClick: () => {}, onExternalDrop: () => {} };
ContentCalendar.propTypes = { events: PropTypes.array, onOpenModal: PropTypes.func.isRequired, onEventClick: PropTypes.func, onExternalDrop: PropTypes.func, onRangeChange: PropTypes.func };

export default ContentCalendar;