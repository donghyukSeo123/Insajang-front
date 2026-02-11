import React, { useState } from "react";
import PropTypes from "prop-types"; // 1. 라이브러리 임포트

// @mui material 컴포넌트
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React 컴포넌트
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

function ProjectModal({ open, onClose, projects, setProjects }) {
  const [newProjectName, setNewProjectName] = useState("");

  const handleAdd = () => {
    if (newProjectName.trim()) {
      setProjects([...projects, { project_id: Date.now(), name: newProjectName }]);
      setNewProjectName("");
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`${name} 프로젝트를 삭제하시겠습니까?`)) {
      setProjects(projects.filter((p) => p.project_id !== id));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" sx={{ "& .MuiPaper-root": { borderRadius: "20px" } }}>
      <DialogTitle>
        <MDTypography variant="h5" fontWeight="bold">프로젝트 관리</MDTypography>
      </DialogTitle>
      <DialogContent>
        <MDBox display="flex" gap={1} mb={3} mt={1}>
          <MDInput 
            fullWidth label="새 프로젝트 이름" 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)} 
          />
          <MDButton variant="gradient" color="info" onClick={handleAdd}>추가</MDButton>
        </MDBox>
        <Divider />
        <MDBox sx={{ maxHeight: "300px", overflow: "auto", mt: 2 }}>
          {projects.map((p) => (
            <MDBox key={p.project_id} display="flex" justifyContent="space-between" alignItems="center" py={1.5} sx={{ borderBottom: "1px solid #f0f2f5" }}>
              <MDTypography variant="body2" fontWeight="medium">{p.name}</MDTypography>
              <IconButton color="error" onClick={() => handleDelete(p.project_id, p.name)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </MDBox>
          ))}
        </MDBox>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <MDButton onClick={onClose} color="secondary">닫기</MDButton>
      </DialogActions>
    </Dialog>
  );
}


ProjectModal.propTypes = {
  open: PropTypes.bool.isRequired, // open은 불리언이고 필수다
  onClose: PropTypes.func.isRequired, // onClose는 함수고 필수다
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      project_id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired, // projects는 특정 모양을 가진 객체의 배열이다
  setProjects: PropTypes.func.isRequired,
};

export default ProjectModal;