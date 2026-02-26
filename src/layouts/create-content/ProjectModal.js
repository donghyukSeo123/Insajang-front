import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // 1. 라이브러리 임포트

// @mui material 컴포넌트
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React 컴포넌트
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// API 유틸리티
import API from "utils/api";

function ProjectModal({ open, onClose, projects, setProjects }) {
  const [newProjectName, setNewProjectName] = useState("");


  // 1. 페이지 로드시 프로젝트 목록 불러오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get("/api/projects/getUserProjects");
        
        if (response.status === 200) {
          setProjects(response.data); // 서버에서 받아온 배열을 상태에 저장
        }
      } catch (error) {
        console.error("프로젝트 목록 로딩 실패:", error);
      }
    };

    fetchProjects();
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회 실행


  const handleAdd = async () => {
    // 방어 코드: 입력값이 없으면 중단
    if (!newProjectName.trim()) {
      alert("프로젝트 이름을 입력해주세요.");
      return;
    }

    try {
      //백엔드로 프로젝트 생성 요청
      const response = await API.post("/api/projects/createProject", 
        { name: newProjectName }
      );

      //응답 상태 코드가 200(또는 201)인 경우 성공 처리
      if (response.status === 200 || response.status === 201) {
        alert("프로젝트가 생성되었습니다!");
        
        console.log(response.data);
        // 서버에서 생성되어 내려온 새 프로젝트 객체를 상태에 추가
        setProjects([...projects, response.data]);
        
        // 입력창 초기화
        setNewProjectName("");
      }
    } catch (error) {
      console.error("프로젝트 생성 에러:", error);
      
      // 로그인 코드에서 쓰신 방식처럼 서버 에러 메시지 출력
      const errorMsg = error.response?.data || "프로젝트 생성에 실패했습니다.";
      alert(errorMsg);
    }
  };

const handleDelete = async (projectId, projectName) => {
  if (!window.confirm(`'${projectName}' 프로젝트를 정말 삭제하시겠습니까?`)) {
    return;
  }

  try {
    // 백엔드 호출 (DELETE 메서드 활용)
    console.log(projectId);
    const response = await API.delete(`/api/projects/${projectId}`);

    // 성공 시 화면 갱신 (200 OK 또는 204 No Content)
    if (response.status === 200 || response.status === 204) {
      alert("삭제되었습니다.");

      // ] 현재 projects 배열에서 삭제한 ID만 제외하고 다시 set
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    }
  } catch (error) {
    console.error("삭제 실패:", error);
    
    const errorMsg = error.response?.data || "삭제 중 오류가 발생했습니다.";
    alert(errorMsg);
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
            <MDBox key={p.id} display="flex" justifyContent="space-between" alignItems="center" py={1.5} sx={{ borderBottom: "1px solid #f0f2f5" }}>
              <MDTypography variant="body2" fontWeight="medium">{p.name}</MDTypography>
              <IconButton color="error" onClick={() => handleDelete(p.id, p.name)}>
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
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired, // projects는 특정 모양을 가진 객체의 배열이다
  setProjects: PropTypes.func.isRequired,
};

export default ProjectModal;