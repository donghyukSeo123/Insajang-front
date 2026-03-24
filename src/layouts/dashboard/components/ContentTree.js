/* src/layouts/dashboard/components/ContentTree.js */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
 // API 유틸리티
import API from "utils/api";

function ContentTree({ onContentClick }) {
  
  // 1. 서버에서 가져온 트리 데이터를 담을 공간
  const [treeData, setTreeData] = useState([]);

  // 2. [운영 방식] 데이터 로드 함수
  const getTreeStructure = async () => {
    try {
      const response = await API.get("/api/contents/selectContentsTree");
      setTreeData(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error("트리 로딩 실패:", error);
    }
  };

  // 3. 컴포넌트 진입 시 한 번만 실행
  useEffect(() => {
    getTreeStructure();
  }, []); // 👈 빈 배열: 마운트 시 1회 실행

  const handleItemClick = (event, nodeId, label) => {
    // 폴더가 아닌 '파일' 형태일 때만 모달을 띄우고 싶다면 조건을 걸 수 있습니다.
    if (nodeId.includes("-file")) {
      onContentClick(label);
    }
  };

  // 🚀 [에러 해결] 재귀적 렌더링 함수 정의
  // 🚀 [에러 해결] 재귀적 렌더링 함수 수정
  const renderTreeNodes = (node) => {
    // 1. 프로젝트(폴더) 노드인 경우 (자식 리스트 children이 존재함)
    if (node.children && node.children.length > 0) {
      return (
        <TreeItem
          key={`folder-${node.projectId}`}
          nodeId={`folder-${node.projectId}`}
          label={node.name}
          icon={<FolderIcon sx={{ color: "#e29578" }} />}
        >
          {/* 자식 컨텐츠들을 재귀적으로 렌더링 */}
          {node.children.map((child) => renderTreeNodes(child))}
        </TreeItem>
      );
    }

    // 2. [추가] 컨텐츠(파일) 노드인 경우 
    // children이 없는 노드는 파일로 간주하여 리턴합니다.
    return (
      <TreeItem
        key={`file-${node.contentId}`}
        nodeId={String(node.contentId)}
        label={node.title || "제목 없음"}
        icon={<DescriptionIcon sx={{ color: "#2196f3" }} />}
      />
    );
  };

  return (

    <Card sx={{ height: "100%", minHeight: "750px", bgcolor: "#f8f9fa" }}>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
          컨텐츠 라이브러리
        </MDTypography>
        <MDBox mt={2} sx={{ overflowY: "auto", maxHeight: "650px" }}>
          <TreeView
            defaultCollapseIcon={<FolderIcon sx={{ color: "#e29578" }} />}
            defaultExpandIcon={<FolderIcon sx={{ color: "#e29578" }} />}
            onNodeSelect={(event, nodeId) => {
              // 폴더가 아닌 파일 아이디인 경우에만 클릭 이벤트(모달 등) 실행
              if (!nodeId.includes("folder")) onContentClick(nodeId);
            }}
          >
            {/* 5. 서버에서 받아온 데이터를 기반으로 트리 생성 */}
            {treeData.length > 0 ? (
              treeData.map((node) => renderTreeNodes(node))
            ) : (
              <MDTypography variant="caption" sx={{ p: 2, display: 'block' }}>
                데이터를 불러오는 중입니다...
              </MDTypography>
            )}
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