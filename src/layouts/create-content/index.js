import React, { useState, useEffect } from "react";
import axios from "axios";

// @mui material 컴포넌트
import { Grid, Card, Divider, IconButton, Tooltip, MenuItem } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Material Dashboard 2 React 컴포넌트
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// 레이아웃 컴포넌트
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProjectModal from "./ProjectModal";
 // API 유틸리티
import API from "utils/api";

function CreateContent() {
  const [projects, setProjects] = useState([]); 
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [title, setTitle] = useState(""); 
  const [inputText, setInputText] = useState(""); 
  const [convertedContent, setConvertedContent] = useState(null);
  const [selectedType, setSelectedType] = useState(""); 
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get("/api/projects/getUserProjects");
        
        if (response.status === 200) {
          setProjects(response.data); // 서버에서 받아온 배열을 상태에 저장
          console.log(response.data);
        }
      } catch (error) {
        console.error("프로젝트 목록 로딩 실패:", error);
      }
    };

    fetchProjects();
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회 실행

  const handleConvert = async (type) => {
    if (!selectedProjectId || !title || !inputText) {
      alert("프로젝트, 주제, 내용을 모두 입력해주세요!");
      return;
    }
    setIsSpinning(true);
    setSelectedType(type);

    try {
      const response = await API.post("/api/contents/createContent", {
        project_id: selectedProjectId,
        title: title,
        user_input: inputText,
        content_type: type
      });
      setConvertedContent(response.data.generated_text);
    } catch (error) {
      alert("서버 통신 실패! 파이썬 서버가 켜져 있는지 확인하세요.");
    } finally {
      setIsSpinning(false);
    }
  };

  const handleCopy = () => {
    const el = document.getElementById("content-display-area");
    if (selectedType === "BLOG") {
      const range = document.createRange();
      range.selectNode(el);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      alert("네이버 블로그 서식 복사 완료!");
      selection.removeAllRanges();
    } else {
      navigator.clipboard.writeText(el.innerText);
      alert("인스타그램 문구 복사 완료!");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={9}>
            <Card sx={{ borderRadius: "24px", border: "none", mb: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}>
              <MDBox p={5}>
                <MDTypography variant="h4" fontWeight="bold" mb={3}>컨텐츠 메이커 스튜디오</MDTypography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}> {/* 한 줄 전체를 써서 큼직하게 배치 */}
                    <MDBox display="flex" flexDirection="column" gap={1}>
                      <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" px={1}>
                        <MDTypography variant="h6" fontWeight="bold" color="dark">
                          📂 프로젝트 선택
                        </MDTypography>
                        
                        {/* 버튼을 더 크게, 강조된 스타일로 변경 */}
                        <MDButton 
                          variant="gradient" 
                          color="info" 
                          size="small"
                          onClick={() => setIsModalOpen(true)}
                          sx={{ borderRadius: "8px", px: 3 }}
                        >
                          프로젝트 추가 / 삭제
                        </MDButton>
                      </MDBox>

                      <MDInput
                        select 
                        fullWidth 
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        sx={{ 
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            height: "38px", // 높이를 키워서 듬직하게
                            fontSize: "1.1rem",
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                          }
                        }}
                        SelectProps={{
                                  displayEmpty: true, // 값이 비어 있어도 MenuItem을 보여주게 합니다.
                                }}
                      >
                        <MenuItem value="" sx={{ py: 1.5 }}>프로젝트를 선택하세요</MenuItem>
                        {projects.map((p) => (
                          <MenuItem key={p.id} value={p.id} sx={{ py: 1.5, fontSize: "1rem" }}>
                            {p.name}
                          </MenuItem>
                        ))}
                      </MDInput>
                    </MDBox>
                  </Grid>

                  {/* 2단: 주제 입력 */}
                  <Grid item xs={12}>
                    <MDTypography variant="button" fontWeight="bold" color="text" ml={1}>포스팅 주제</MDTypography>
                    <MDInput 
                      fullWidth placeholder="예: 무릎 안 아픈 북한산 트래킹 코스 추천" 
                      value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 1 }}
                    />
                  </Grid>

                  {/* 3단: 키워드 입력 */}
                  <Grid item xs={12}>
                    <MDTypography variant="button" fontWeight="bold" color="text" ml={1}>핵심 키워드 및 아이디어</MDTypography>
                    <MDInput
                      fullWidth multiline rows={6}
                      placeholder="AI가 본문에 녹여낼 키워드들을 적어주세요..."
                      value={inputText} onChange={(e) => setInputText(e.target.value)} sx={{ mt: 1 }}
                    />
                  </Grid>
                </Grid>

                <MDBox mt={4} display="flex" gap={2} justifyContent="center">
                  <MDButton variant="contained" onClick={() => handleConvert("INSTA")}
                    sx={{ background: "linear-gradient(135deg, #E1306C, #F77737)", color: "white", px: 4, borderRadius: "12px" }}>
                    인스타 피드 생성
                  </MDButton>
                  <MDButton variant="contained" onClick={() => handleConvert("BLOG")}
                    sx={{ background: "#1A2035", color: "white", px: 4, borderRadius: "12px" }}>
                    네이버 블로그 생성
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>

            {convertedContent && (
              <Card sx={{ borderRadius: "24px", border: "none" }}>
                <MDBox p={4}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDTypography variant="h6">{selectedType === "INSTA" ? "📱 인스타 피드" : "📝 블로그 포스팅"}</MDTypography>
                    <MDBox display="flex" gap={1}>
                      <MDButton variant="gradient" color="info" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
                        {selectedType === "INSTA" ? "문구 복사" : "전체 서식 복사"}
                      </MDButton>
                      <IconButton onClick={() => handleConvert(selectedType)} sx={{ animation: isSpinning ? "spin 1s linear infinite" : "none" }}>
                        <RefreshIcon />
                      </IconButton>
                    </MDBox>
                  </MDBox>
                  <Divider />
                  <MDBox id="content-display-area" mt={3} p={4} sx={{ backgroundColor: "#fcfcfd", borderRadius: "18px", border: "1px solid #eee", whiteSpace: selectedType === "INSTA" ? "pre-wrap" : "normal" }}>
                    {selectedType === "INSTA" ? (
                      <MDTypography variant="body1" sx={{ color: "#333" }}>{convertedContent}</MDTypography>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: convertedContent }} style={{ color: "#333" }} />
                    )}
                  </MDBox>
                </MDBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>


      <ProjectModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projects={projects} 
        setProjects={setProjects} 
      />
      <Footer />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default CreateContent;