/* react/prop-types: 0 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

function ScheduleModal({ open, onClose, selectedDate, droppedContent, onSave }) {
  const [title, setTitle] = useState("");
  const [ampm, setAmpm] = useState("AM"); // AM 또는 PM
  const [selectedHour, setSelectedHour] = useState(9); // 실제 24시간제 값 (0~23)

  // 모달 오픈 또는 드롭 데이터 변경 시 초기화
  useEffect(() => {
    if (open) {
      setTitle(droppedContent?.title || "");
      setAmpm("AM");
      setSelectedHour(9); // 기본값 오전 09시
    }
  }, [open, droppedContent]);

  // 오전/오후 탭 변경 시, 선택된 시간도 해당 시간대에 맞춰 첫 번째 시간으로 자동 전환
  const handleAmpmChange = (event, newAmpm) => {
    if (newAmpm !== null) {
      setAmpm(newAmpm);
      setSelectedHour(newAmpm === "AM" ? 0 : 12); // 오전 클릭 시 00시, 오후 클릭 시 12시 기본 선택
    }
  };

  // 시간 버튼 클릭 핸들러
  const handleHourChange = (event, newHour) => {
    if (newHour !== null) {
      setSelectedHour(newHour);
    }
  };

  const handleSave = () => {
    const finalData = {
      // selectedHour에 이미 0~23의 값이 정확히 들어있으므로 그대로 포맷팅
      scheduledAt: selectedDate.hour(selectedHour).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss"),
      contentId: droppedContent?.contentId || null,
    };
    
    if (onSave) onSave(finalData);
    onClose();
  };

  // [핵심] 오전/오후 선택에 따라 다른 24시간제 배열을 생성
  // AM 버튼 활성화 시: 00시 ~ 11시
  // PM 버튼 활성화 시: 12시 ~ 23시
  const availableHours = ampm === "AM" 
    ? Array.from({ length: 12 }, (_, i) => i)       // [0, 1, 2, ..., 11]
    : Array.from({ length: 12 }, (_, i) => i + 12); // [12, 13, 14, ..., 23]

  return (
    <Modal open={open} onClose={onClose}>
      <MDBox sx={style}>
        <MDTypography variant="h6" fontWeight="medium">새 컨텐츠 일정 등록</MDTypography>
        
        <MDBox mt={3} display="flex" flexDirection="column" gap={3}>
          {/* 1. 날짜 표시 (읽기 전용) */}
          <MDInput 
            label="선택된 날짜" 
            value={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""} 
            fullWidth 
            disabled 
          />

          {/* 2. 컨텐츠 제목 입력 */}
          <MDInput 
            label="컨텐츠 제목" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            fullWidth 
            disabled
            placeholder="컨텐츠명을 드래그하여 입력하세요"
          />

          {/* 3. 시간 설정 (AM/PM에 따라 다른 24H 숫자가 보임) */}
          <MDBox>
            <MDTypography variant="caption" color="text" fontWeight="medium" mb={1} display="block">
              게시 시간 설정
            </MDTypography>
            
            {/* 오전 / 오후 전환 버튼 */}
            <ToggleButtonGroup
              value={ampm}
              exclusive
              onChange={handleAmpmChange}
              fullWidth
              size="small"
              sx={{ mb: 1.5, height: "40px" }}
            >
              <ToggleButton value="AM" sx={{ fontWeight: "bold" }}>오전 (AM)</ToggleButton>
              <ToggleButton value="PM" sx={{ fontWeight: "bold" }}>오후 (PM)</ToggleButton>
            </ToggleButtonGroup>

            {/* 동적으로 변하는 시간 Grid */}
            <ToggleButtonGroup
              value={selectedHour}
              exclusive
              onChange={handleHourChange}
              fullWidth
              size="small"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "6px",
                border: "none",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid #ddd !important",
                  borderRadius: "8px !important",
                  py: 1,
                  fontSize: "0.9rem",
                },
                "& .Mui-selected": {
                  backgroundColor: "#1A73E8 !important",
                  color: "#fff !important",
                  fontWeight: "bold",
                }
              }}
            >
              {availableHours.map((h) => (
                <ToggleButton key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </MDBox>

          {/* 하단 버튼 영역 */}
          <MDBox mt={1} display="flex" justifyContent="flex-end">
            <MDButton variant="text" color="secondary" onClick={onClose} sx={{ mr: 1 }}>
              취소
            </MDButton>
            <MDButton variant="gradient" color="info" onClick={handleSave}>
              저장하기
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

ScheduleModal.defaultProps = {
  droppedContent: null,
};

ScheduleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  droppedContent: PropTypes.object,
  onSave: PropTypes.func,
};

export default ScheduleModal;