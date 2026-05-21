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

// 상태별 텍스트 및 색상 매핑 함수
const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case "READY":
      return { label: "준비됨", color: "#7b809a", bgColor: "#f0f2f5" };
    case "SCHEDULED":
      return { label: "게시예약", color: "#fb8c00", bgColor: "#fff3e0" };
    case "PUBLISHED":
      return { label: "게시완료", color: "#4caf50", bgColor: "#e8f5e9" };
    default:
      return null;
  }
};

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
          label={
            <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "#344767" }}>
              {node.name}
            </span>
          }
          icon={<FolderIcon sx={{ color: "#e29578", fontSize: "1.25rem !important" }} />}
        >
          {node.children.map((child) => renderTreeNodes(child))}
        </TreeItem>
      );
    }

    const badge = getStatusBadge(node.status);

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
            data-color={node.color || (node.status === "PUBLISHED" ? "#4caf50" : node.status === "SCHEDULED" ? "#fb8c00" : "#2196f3")}
            style={{ 
              padding: "5px 0",
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* 제목 글씨 */}
            <span style={{ 
              whiteSpace: "normal",
              wordBreak: "break-all",
              fontSize: "1rem",
              fontWeight: "500",
              color: "#495057",
              flex: 1,
              marginRight: "10px"
            }}>
              {node.title || "제목 없음"}
            </span>

            {/* 상태 배지 */}
            {badge && (
              <span style={{
                fontSize: "11px",
                fontWeight: "bold",
                padding: "2px 6px",
                borderRadius: "4px",
                color: badge.color,
                backgroundColor: badge.bgColor,
                whiteSpace: "nowrap",
                flexShrink: 0
              }}>
                {badge.label}
              </span>
            )}
          </div>
        }
        icon={
          <DescriptionIcon 
            sx={{ 
              fontSize: "1.2rem !important", 
              color: node.status === "PUBLISHED" ? "#4caf50" : node.status === "SCHEDULED" ? "#fb8c00" : "#2196f3" 
            }} 
          />
        }
      />
    );
  };

  return (
    <Card sx={{ height: "100%", minHeight: "750px", bgcolor: "#f8f9fa" }}>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="bold" gutterBottom>
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