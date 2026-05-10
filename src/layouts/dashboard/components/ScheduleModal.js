/* react/prop-types: 0 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

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

// 00:00부터 23:00까지 1시간 단위 리스트 생성
const hours = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${String(i).padStart(2, "0")}:00`,
}));

function ScheduleModal({ open, onClose, selectedDate, droppedContent, onSave }) {
  const [title, setTitle] = useState("");
  const [selectedHour, setSelectedHour] = useState(9); // 기본값 오전 9시

  // 모달이 열리거나 드롭된 컨텐츠가 바뀔 때 초기값 세팅
  useEffect(() => {
    console.log(selectedDate);
    console.log(droppedContent);

    if (open) {
      setTitle(droppedContent?.title || "");
      setSelectedHour(9);
    }
  }, [open, droppedContent]);

  const handleSave = () => {
    const finalData = {
      scheduledAt: selectedDate.hour(selectedHour).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss"),
      contentId: droppedContent?.contentId || null,
    };
    
    if (onSave) onSave(finalData);
    onClose();
  };

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
            disabled // 혹은 readOnly
            placeholder="컨텐츠명을 드래그하여 입력하세요"
          />

          {/* 3. 시간 선택 (1시간 단위) */}
          <FormControl fullWidth>
            <InputLabel id="hour-select-label">게시 시간</InputLabel>
            <Select
              labelId="hour-select-label"
              value={selectedHour}
              label="게시 시간"
              onChange={(e) => setSelectedHour(e.target.value)}
              sx={{ height: "45px" }}
            >
              {hours.map((hour) => (
                <MenuItem key={hour.value} value={hour.value}>
                  {hour.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 하단 버튼 영역 */}
          <MDBox mt={2} display="flex" justifyContent="flex-end">
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
  droppedContent: PropTypes.object, // 드롭된 컨텐츠 정보 (title, contentId 등)
  onSave: PropTypes.func, // 부모에게 데이터를 전달할 저장 함수
};

export default ScheduleModal;