import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import AddIcon from "@mui/icons-material/Add";

function ContentCalendar({ value, onChange, onOpenModal }) {
  return (
    <Card sx={{ height: "100%", minHeight: "750px" }}>
      <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium">콘텐츠 마스터 캘린더</MDTypography>
          <MDTypography variant="button" color="text">
          </MDTypography>
        </MDBox>
        <MDButton variant="gradient" color="info" size="small" onClick={onOpenModal}>
          <AddIcon /> &nbsp; 일정 등록
        </MDButton>
      </MDBox>
      <Divider sx={{ my: 0 }} />
      
      {/* 달력 꽉 채우기 스타일 오버라이드 */}
      <MDBox p={2} sx={{ 
        display: "flex", 
        justifyContent: "center",
        width: "100%",
        "& .MuiDateCalendar-root": { 
          width: "100% !important", 
          height: "600px !important", 
          maxHeight: "none !important" 
        },
        "& .MuiDayCalendar-header": {
          justifyContent: "space-around", // 요일 간격 넓히기
          width: "100%"
        },
        "& .MuiDayCalendar-weekContainer": {
          justifyContent: "space-around", // 날짜 간격 넓히기
          width: "100%",
          margin: "12px 0"
        },
        "& .MuiPickersDay-root": { 
          fontSize: "1.2rem", // 날짜 숫자 크기
          width: "55px", 
          height: "55px",
          fontWeight: "bold"
        },
        "& .MuiDayCalendar-slideTransition": {
          minHeight: "520px" // 달력 몸통 높이 확보
        }
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={value} onChange={onChange} />
        </LocalizationProvider>
      </MDBox>
    </Card>
  );
}

ContentCalendar.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};

export default ContentCalendar;