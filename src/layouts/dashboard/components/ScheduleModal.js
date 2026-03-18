/* react/prop-types: 0 */ // 만약 계속 에러가 나면 이 주석을 활용하세요
import PropTypes from "prop-types"; // 1. PropTypes 임포트
import Modal from "@mui/material/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

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

function ScheduleModal({ open, onClose, selectedDate }) {
  return (
    <Modal open={open} onClose={onClose}>
      <MDBox sx={style}>
        <MDTypography variant="h6" fontWeight="medium">새 컨텐츠 일정 등록</MDTypography>
        <MDBox mt={3}>
          <MDTypography variant="button" color="text">
            날짜: {selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
          </MDTypography>
          {/* 입력 필드 등이 들어갈 자리 */}
          <MDBox mt={4} display="flex" justifyContent="flex-end">
            <MDButton variant="text" color="secondary" onClick={onClose} sx={{ mr: 1 }}>
              취소
            </MDButton>
            <MDButton variant="gradient" color="info" onClick={onClose}>
              저장하기
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

// 2. Props 검증 설정 추가
ScheduleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

export default ScheduleModal;