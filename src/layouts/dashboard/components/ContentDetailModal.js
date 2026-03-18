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
  maxHeight: '85vh', // 높이를 살짝 더 키웠습니다.
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
  display: 'flex',
  flexDirection: 'column',
};

function ContentDetailModal({ open, onClose, contentName }) {
  // 나중에 DB에서 받아올 가상의 HTML 양식 데이터
  const mockHtmlPreview = `
    <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
      <h2 style="color: #1A73E8; border-bottom: 2px solid #1A73E8; padding-bottom: 10px;">
        🚀 콘텐츠 메이커 스튜디오: AI 활용 가이드
      </h2>
      <p>안녕하세요! <strong>콘텐츠 메이커 스튜디오</strong>에서 생성된 블로그 포스트 초안입니다.</p>
      <ul style="background: #f1f3f4; padding: 15px; border-radius: 8px; list-style: none;">
        <li>✅ <strong>주제:</strong> 리액트 대시보드 커스터마이징</li>
        <li>✅ <strong>타겟:</strong> 초보 개발자 및 1인 크리에이터</li>
        <li>✅ <strong>키워드:</strong> #React #MaterialUI #Dashboard</li>
      </ul>
      <p style="margin-top: 20px;">
        본문 내용은 여기에 들어갑니다. PostgreSQL과 Spring Boot를 연동하여 실시간 데이터를 
        가져오는 방법은 다음과 같습니다... (중략)
      </p>
      <div style="background: #e8f0fe; border-left: 5px solid #1A73E8; padding: 10px; margin: 20px 0;">
        💡 <em>TIP: MUI X TreeView v6 버전을 사용하면 더 안정적인 레이아웃을 구성할 수 있습니다.</em>
      </div>
      <p>감사합니다!</p>
    </div>
  `;

  return (
    <Modal open={open} onClose={onClose}>
      <MDBox sx={style}>
        {/* 상단 헤더 */}
        <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium" color="info">
              콘텐츠 프리뷰 (HTML)
            </MDTypography>
            <MDTypography variant="button" color="text">
              파일명: {contentName || "제목 없음"}
            </MDTypography>
          </MDBox>
          {/* 복사 버튼 같은 기능 추가 가능 */}
          <MDButton variant="outlined" color="info" size="small">
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
          
          {/* 실제 HTML 양식을 보여주는 프리뷰 박스 */}
          <MDBox 
            sx={{ 
              border: "1px solid #ddd", 
              borderRadius: "12px", 
              bgcolor: "#ffffff",
              minHeight: "400px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
            }}
            // dangerouslySetInnerHTML를 사용하여 문자열 형태의 HTML을 실제 태그로 렌더링
            dangerouslySetInnerHTML={{ __html: mockHtmlPreview }} 
          />

          <MDBox mt={3}>
            <MDTypography variant="h6">관련 해시태그 및 메모</MDTypography>
            <MDBox mt={1} p={2} bgcolor="#f8f9fa" borderRadius="lg">
              <MDTypography variant="body2" color="secondary">
                #인스타그램 #블로그마케팅 #자동화프로젝트 #동혁님화이팅
              </MDTypography>
            </MDBox>
          </MDBox>
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
  contentName: PropTypes.string,
};

export default ContentDetailModal;