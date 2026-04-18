/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// [중요] 에디터 라이브러리 및 CSS
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70vw', 
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
  display: 'flex',
  flexDirection: 'column',
};

// 툴바 설정
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

function ContentDetailModal({ open, onClose, data, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    if (data && open) {
      setEditedTitle(data.title || "");
      setEditedContent(data.body || data.content || "");
      setIsEditing(false);
    }
  }, [data, open]);

  if (!data) return null;

  const handleSave = () => {
    onUpdate(data.contentId, { title: editedTitle, body: editedContent });
    setIsEditing(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <MDBox sx={style}>
        {/* 상단 헤더 */}
        <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox sx={{ flex: 1, mr: 2 }}>
            {isEditing ? (
              <MDInput 
                fullWidth 
                label="제목"
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <MDTypography variant="h4" fontWeight="medium" color="info">
                {editedTitle || "제목 없음"}
              </MDTypography>
            )}
          </MDBox>
          <MDBox display="flex" gap={1}>
            <MDButton variant="outlined" color="error" size="small" onClick={() => onDelete(data.contentId)}>
              삭제
            </MDButton>
          </MDBox>
        </MDBox>
        
        <Divider />

        {/* 본문 영역 */}
        <MDBox 
          sx={{ 
            overflowY: "auto", 
            flex: 1,
            mt: 2,
            minHeight: "500px", // 에디터가 충분히 보일 공간 확보
            "& .ql-editor": { minHeight: "400px" } // 에디터 내부 높이 강제
          }}
        >
          {isEditing ? (
            <MDBox sx={{ bgcolor: "#fff", color: "#000" }}>
              <ReactQuill 
                theme="snow" 
                value={editedContent} 
                onChange={setEditedContent} 
                modules={quillModules}
              />
            </MDBox>
          ) : (
            <MDBox 
              sx={{ 
                p: 2, 
                border: "1px solid #ddd", 
                borderRadius: "8px",
                "& img": { maxWidth: "100%" } 
              }}
              dangerouslySetInnerHTML={{ __html: editedContent }} 
            />
          )}
        </MDBox>

        <Divider sx={{ my: 2 }} />

        {/* 하단 제어 버튼 */}
        <MDBox display="flex" justifyContent="flex-end" gap={1}>
          {isEditing ? (
            <>
              <MDButton variant="gradient" color="info" onClick={handleSave}>저장</MDButton>
              <MDButton variant="outlined" color="dark" onClick={() => setIsEditing(false)}>취소</MDButton>
            </>
          ) : (
            <>
              <MDButton variant="outlined" color="info" onClick={() => {
                const text = editedContent;
                navigator.clipboard.writeText(text);
                alert("복사되었습니다.");
              }}>HTML 복사</MDButton>
              <MDButton variant="gradient" color="info" onClick={() => setIsEditing(true)}>수정하기</MDButton>
              <MDButton variant="gradient" color="dark" onClick={onClose}>닫기</MDButton>
            </>
          )}
        </MDBox>
      </MDBox>
    </Modal>
  );
}

export default ContentDetailModal;