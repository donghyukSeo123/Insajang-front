/* src/layouts/dashboard/components/ContentTree.js */
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ContentTree({ onContentClick }) {
  // 아이템 클릭 핸들러
  const handleItemClick = (event, nodeId, label) => {
    // 폴더가 아닌 '파일' 형태일 때만 모달을 띄우고 싶다면 조건을 걸 수 있습니다.
    if (nodeId.includes("-file")) {
      onContentClick(label);
    }
  };

  return (
    <Card sx={{ height: "100%", minHeight: "750px", bgcolor: "#f8f9fa" }}>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium" gutterBottom>컨텐츠 라이브러리</MDTypography>
        <MDBox mt={2} sx={{ overflowY: "auto", maxHeight: "650px" }}>
          <TreeView
            defaultCollapseIcon={<FolderIcon sx={{ color: "#e29578" }} />}
            defaultExpandIcon={<FolderIcon sx={{ color: "#e29578" }} />}
            // 노드 선택 시 이벤트 발생
            onNodeSelect={(event, nodeId) => {
              // 실제 구현 시에는 데이터 구조에서 이름을 찾아와야 하지만, 
              // 일단 예시로 nodeId를 넘깁니다.
              if (!nodeId.includes("folder")) onContentClick(nodeId);
            }}
          >
            <TreeItem nodeId="folder-1" label={<MDTypography variant="button">인스타그램</MDTypography>}>
              <TreeItem 
                nodeId="카드뉴스_v1.png" 
                label={<MDTypography variant="button">카드뉴스_v1.png</MDTypography>} 
              />
            </TreeItem>
            <TreeItem nodeId="folder-2" label={<MDTypography variant="button">네이버 블로그</MDTypography>}>
              <TreeItem 
                nodeId="포스팅_임시저장.docx" 
                label={<MDTypography variant="button">포스팅_임시저장.docx</MDTypography>} 
              />
            </TreeItem>
          </TreeView>
        </MDBox>
      </MDBox>
    </Card>
  );
}

ContentTree.propTypes = {
  onContentClick: PropTypes.func.isRequired,
};

export default ContentTree;