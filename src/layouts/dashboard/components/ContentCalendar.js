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

function ContentCalendar({ events, onOpenModal, onEventClick, onExternalDrop }) {
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
    <Card sx={{ height: "100%", minHeight: "800px", boxShadow: "none" }}>
      <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium">
            콘텐츠 마스터 캘린더
          </MDTypography>
          <MDBox display="flex" alignItems="center" mt={0.5}>
            <MDButton variant="text" color="dark" iconOnly onClick={handlePrev}>
              <Icon>chevron_left</Icon>
            </MDButton>
            
            {/* 이 버튼의 글자가 이제 자동으로 바뀝니다 */}
            <MDButton variant="text" color="dark" sx={{ mx: 1, fontSize: "1.1rem", fontWeight: "bold" }} onClick={handleToday}>
              {calendarTitle}
            </MDButton>

            <MDButton variant="text" color="dark" iconOnly onClick={handleNext}>
              <Icon>chevron_right</Icon>
            </MDButton>
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
        "& .fc-event": { border: "none", borderRadius: "6px", padding: "3px 8px", cursor: "pointer" }
      }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height="650px"
          events={events}
          titleFormat={{ year: "numeric", month: "long" }}
          
          // 핵심: 날짜가 변경(버튼 클릭 포함)될 때마다 실행됨
          datesSet={(arg) => {
            setCalendarTitle(arg.view.title);
          }}

          droppable={true} 
          drop={handleDrop} 
          editable={true}
          eventReceive={(info) => info.revert()}
          dateClick={(info) => onOpenModal(info.dateStr)}
          eventClick={(info) => onEventClick(info.event)}
          dayMaxEvents={3}
        />
      </MDBox>
    </Card>
  );
}

ContentCalendar.defaultProps = { events: [], onEventClick: () => {}, onExternalDrop: () => {} };
ContentCalendar.propTypes = { events: PropTypes.array, onOpenModal: PropTypes.func.isRequired, onEventClick: PropTypes.func, onExternalDrop: PropTypes.func };

export default ContentCalendar;