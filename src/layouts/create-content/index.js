import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // 에디터 스타일

// @mui material 컴포넌트
import { Grid, Card, Divider, IconButton, MenuItem, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


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

// Quill 에디터 툴바 설정
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

function CreateContent() {
  const [projects, setProjects] = useState([]); 
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [title, setTitle] = useState(""); 
  const [inputText, setInputText] = useState(""); 
  const [finalTitle, setFinalTitle] = useState(""); // 최종저장될 컨텐츠 제목
  const [editedContent, setEditedContent] = useState(""); // 에디터에서 수정 중인 내용
  const [convertedContent, setConvertedContent] = useState(null);
  const [selectedType, setSelectedType] = useState(""); 
  const [currentLogId, setCurrentLogId] = useState(null); //컨텐츠요청로그아이디
  // 상태 제어
  const [isSpinning, setIsSpinning] = useState(false); // 생성 로딩
  const [isSaving, setIsSaving] = useState(false); // DB 저장 로딩
  const [isEditing, setIsEditing] = useState(false); // 에디터 모드 활성화
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
    setConvertedContent(null);
    setSelectedType(type);
    setIsEditing(false); // 생성 시에는 편집 모드 해제

    try {
      const response = await API.post("/api/contents/createContent", {
        project_id: selectedProjectId,
        title: title,
        user_input: inputText,
        content_type: type,
      },
      {
         timeout: 60000 // 🚀 여기서 콤마 찍고 따로 설정해야 Axios가 60초를 기다려줍니다!
      }
    );
      setFinalTitle(response.data.generated_title); 
  setEditedContent(response.data.generated_text);

        // 3. 🚀 '기억 장치(State)'에 집어넣습니다!
      setEditedContent(response.data.generated_text);
      setCurrentLogId(response.data.log_id); // 이제 이 값은 컴포넌트가 살아있는 한 유지됩니다.
      setConvertedContent(response.data.generated_text);
      setFinalTitle(response.data.generated_title);
    } catch (error) {
      alert("서버 통신 실패! 파이썬 서버가 켜져 있는지 확인하세요.");
    } finally {
      setIsSpinning(false);
    }
  };

  // 2. DB 최종 저장 버튼
  const handleFinalSave = async () => {
    setIsSaving(true);
    try {
      await API.post("/api/contents/saveGeneratedContent", {
        project_id: selectedProjectId,
        title: title,
        content: editedContent,
        content_type: selectedType,
      });
      alert("성공적으로 저장되었습니다!");
      setIsEditing(false);
    } catch (error) {
      alert("DB 저장 실패!");
    } finally {
      setIsSaving(false);
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
                  {/* 인스타 피드 생성 버튼 */}
                  <MDButton 
                    variant="contained" 
                    disabled={isSpinning} // 로딩 중 클릭 방지
                    onClick={() => handleConvert("INSTA")}
                    sx={{ background: "linear-gradient(135deg, #E1306C, #F77737)", color: "white", px: 4, borderRadius: "12px" }}
                  >
                    {isSpinning && selectedType === "INSTA" ? (
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    ) : null}
                    {isSpinning && selectedType === "INSTA" ? "생성 중..." : "인스타 피드 생성"}
                  </MDButton>

                  {/* 네이버 블로그 생성 버튼 */}
                  <MDButton 
                    variant="contained" 
                    disabled={isSpinning} // 로딩 중 클릭 방지
                    onClick={() => handleConvert("BLOG")}
                    sx={{ background: "#1A2035", color: "white", px: 4, borderRadius: "12px" }}
                  >
                    {isSpinning && selectedType === "BLOG" ? (
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    ) : null}
                    {isSpinning && selectedType === "BLOG" ? "블로그 생성 중..." : "네이버 블로그 생성"}
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
            
            

            {convertedContent && (
                <Card sx={{ borderRadius: "24px", border: "none", animation: "fadeIn 0.5s" }}>
                  <MDBox p={4}>
                    {/* 1. 최종 제목 입력 섹션 (MDBox 안으로 이동) */}
                    <MDBox mb={4} pb={2} sx={{ borderBottom: "1px solid #f0f2f5" }}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" sx={{ textTransform: "uppercase", letterSpacing: "1px", mb: 1, display: "block" }}>
                        Final Post Title
                      </MDTypography>
                      <input 
                        type="text" 
                        value={finalTitle} 
                        onChange={(e) => setFinalTitle(e.target.value)}
                        className="w-full text-3xl font-extrabold text-gray-800 border-none p-0 focus:ring-0 placeholder-gray-200"
                        style={{ 
                          outline: 'none', 
                          width: '100%', 
                          fontSize: '2rem', 
                          fontWeight: '800', 
                          border: 'none',
                          backgroundColor: 'transparent'
                        }}
                        placeholder="근사한 제목을 확정해주세요..."
                      />
                    </MDBox>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <MDTypography variant="h6">
                        {isEditing ? "📝 컨텐츠 편집 중" : (selectedType === "INSTA" ? "📱 인스타 피드" : "📝 블로그 포스팅")}
                      </MDTypography>
                      <MDBox display="flex" gap={1}>
                        {/* 수정하기/편집완료 버튼 */}
                        <MDButton 
                          variant="outlined" 
                          color="info" 
                          size="small" 
                          startIcon={isEditing ? <CheckCircleIcon /> : <EditIcon />}
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? "편집 완료" : "수정하기"}
                        </MDButton>

                        {/* 최종 저장 버튼 (수정 중이 아닐 때만 노출하거나 활성화) */}
                        <MDButton 
                          variant="gradient" 
                          color="success" 
                          size="small" 
                          startIcon={<SaveIcon />} 
                          onClick={handleFinalSave} 
                          disabled={isSaving || isEditing}
                        >
                          {isSaving ? "저장 중..." : "최종 저장"}
                        </MDButton>

                        <MDButton variant="gradient" color="info" size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
                          복사
                        </MDButton>
                        
                        <IconButton onClick={() => handleConvert(selectedType)} sx={{ animation: isSpinning ? "spin 1s linear infinite" : "none" }}>
                          <RefreshIcon />
                        </IconButton>
                      </MDBox>
                    </MDBox>
                    <Divider />
                    
                    <MDBox id="content-display-area" mt={3} p={2} sx={{ backgroundColor: "#fcfcfd", borderRadius: "18px", border: "1px solid #eee" }}>
                      {isEditing ? (
                        // 편집 모드일 때
                        selectedType === "BLOG" ? (
                          <ReactQuill 
                            theme="snow" 
                            value={editedContent} 
                            onChange={setEditedContent} 
                            modules={quillModules} 
                            style={{ height: "400px", marginBottom: "50px", backgroundColor: "#fff" }}
                          />
                        ) : (
                          <MDInput 
                            fullWidth 
                            multiline 
                            rows={15} 
                            value={editedContent} 
                            onChange={(e) => setEditedContent(e.target.value)} 
                            sx={{ backgroundColor: "#fff" }}
                          />
                        )
                      ) : (
                        // 보기 모드일 때
                        selectedType === "INSTA" ? (
                          <MDTypography variant="body1" sx={{ color: "#333", whiteSpace: "pre-wrap" }}>
                            {editedContent}
                          </MDTypography>
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: editedContent }} style={{ color: "#333" }} />
                        )
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