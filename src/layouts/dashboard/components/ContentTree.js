import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Draggable } from "@fullcalendar/interaction";

function ContentTree({ treeData, onContentClick }) {
  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    
    // Draggable 설정
    let draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          id: eventEl.getAttribute("data-id"),
          title: eventEl.getAttribute("data-title"),
          color: eventEl.getAttribute("data-color") || "#1A73E8",
          // create: true를 삭제하여 드롭 시 즉시 이벤트가 생성되는 것을 방지
        };
      },
    });

    return () => draggable.destroy();
  }, [treeData]);

  const renderTreeNodes = (node) => {
    // 1. 프로젝트(폴더) 노드
    if (node.children && node.children.length > 0) {
      return (
        <TreeItem
          key={`folder-${node.projectId}`}
          nodeId={`folder-${node.projectId}`}
          label={node.name}
          icon={<FolderIcon sx={{ color: "#e29578" }} />}
        >
          {node.children.map((child) => renderTreeNodes(child))}
        </TreeItem>
      );
    }

    // 2. 컨텐츠(파일) 노드
    return (
      <TreeItem
        key={`file-${node.contentId}`}
        nodeId={String(node.contentId)}
        label={
          <div
            className="fc-event"
            data-id={node.contentId}
            data-title={node.title}
            data-color={node.color || "#2196f3"}
            style={{ 
              padding: "4px 8px", 
              cursor: "grab",
              display: "block",
              borderRadius: "4px"
            }}
          >
            {node.title || "제목 없음"}
          </div>
        }
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
        <MDTypography variant="caption" color="text" sx={{ mb: 2, display: 'block' }}>
          콘텐츠를 달력으로 드래그하여 일정을 등록하세요.
        </MDTypography>
        
        <MDBox id="external-events" mt={2} sx={{ overflowY: "auto", maxHeight: "650px" }}>
          <TreeView
            defaultCollapseIcon={<FolderIcon sx={{ color: "#e29578" }} />}
            defaultExpandIcon={<FolderIcon sx={{ color: "#e29578" }} />}
            onNodeSelect={(event, nodeId) => {
              if (!nodeId.includes("folder")) onContentClick(nodeId);
            }}
          >
            {treeData && treeData.length > 0 ? (
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
  treeData: PropTypes.array.isRequired, 
  onContentClick: PropTypes.func.isRequired,
};

export default ContentTree;