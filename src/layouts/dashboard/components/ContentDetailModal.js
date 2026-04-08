/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw', 
  maxHeight: '85vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
  display: 'flex',
  flexDirection: 'column',
};

function ContentDetailModal({ open, onClose, data }) {
  // 1. 데이터가 없을 때를 대비한 방어 코드
  if (!data) return null;

  console.log(data);
  
  // DB 필드 명칭에 맞춰 구조 분해 할당 (백엔드 API 응답 객체 기준)
  // 예: title(제목), content(HTML 본문), hashtags(해시태그), memo(메모)
  const { title, content, body, memo } = data;

  // HTML 복사 핸들러
  const handleCopyHtml = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      alert("HTML 코드가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <MDBox sx={style}>
        {/* 상단 헤더 */}
        <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium" color="info">
              {title || "제목 없음"}
            </MDTypography>
          </MDBox>
          <MDButton variant="outlined" color="info" size="small" onClick={handleCopyHtml}>
            HTML 복사
          </MDButton>
        </MDBox>
        
        <Divider />

        {/* 본문 스크롤 영역 */}
        <MDBox 
          sx={{ 
            overflowY: "auto", 
            flex: 1,
            pr: 1,
            mt: 2,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "10px" }
          }}
        >
          <MDTypography variant="h6" gutterBottom>최종 생성 결과물</MDTypography>
          
          {/* 실제 DB의 HTML 내용을 렌더링 */}
          <MDBox 
            sx={{ 
              border: "1px solid #ddd", 
              borderRadius: "12px", 
              bgcolor: "#ffffff",
              minHeight: "400px",
              p: 2, // 가독성을 위한 패딩
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
              "& *": { maxWidth: "100%" } // 내부 이미지나 테이블이 박스를 나가지 않도록 방지
            }}
            dangerouslySetInnerHTML={{ __html: body || "" }} 
          />
        </MDBox>

        <Divider sx={{ my: 2 }} />

        {/* 하단 닫기 버튼 */}
        <MDBox display="flex" justifyContent="flex-end">
          <MDButton variant="gradient" color="dark" onClick={onClose}>
            닫기
          </MDButton>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

ContentDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    hashtags: PropTypes.string,
    memo: PropTypes.string,
  }),
};

export default ContentDetailModal;