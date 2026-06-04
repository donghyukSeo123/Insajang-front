/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect } from "react";

// react-router-dom components
import { NavLink, useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";

// Material Dashboard 2 React context
import {
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  useMaterialUIController,
} from "context";

// Flat Vector SVG Logo Component representing C + Magic Sparkle (Consistent with Sign-In/Sign-Up)
const ContentsMakerLogo = ({ size = 80 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <defs>
      <linearGradient id="slateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" /> {/* Clean Cyan */}
        <stop offset="100%" stopColor="#818cf8" /> {/* Clean Indigo */}
      </linearGradient>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    
    {/* Minimalist Vector "C" Emblem */}
    <path 
      d="M 50,14 A 36,36 0 1,0 86,50 C 86,39 79,32 74,32" 
      fill="none" 
      stroke="url(#slateGrad)" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />
    
    {/* Inner Accent Ring */}
    <path 
      d="M 50,28 A 22,22 0 1,0 68,50 C 68,41 53,43 53,35" 
      fill="none" 
      stroke="url(#slateGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      opacity="0.7"
    />
    
    {/* Sharp 4-Point Star Sparkle */}
    <path 
      d="M 77,15 Q 77,25 67,25 Q 77,25 77,35 Q 77,25 87,25 Q 77,25 77,15 Z" 
      fill="url(#starGrad)" 
    />
    
    {/* Decorative Accent Dot */}
    <circle cx="56" cy="20" r="1.5" fill="#38bdf8" />
  </svg>
);

ContentsMakerLogo.propTypes = {
  size: PropTypes.number,
};


function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      {/* 1. px={4}를 px={1}로 줄여서 양옆 공간을 확보했습니다. */}
      <MDBox pt={1} pb={0} px={1} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        {/* 2. 로고와 글자 레이아웃을 세로(column) 정렬로 바꾸고 중앙 정렬했습니다. */}
        <MDBox component={NavLink} to="/" display="flex" flexDirection="column" alignItems="center">
          <MDBox
            mt={miniSidenav ? 1.5 : 2.5}
            mb={miniSidenav ? 1 : 1.5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.2s ease"
            }}
          >
            <ContentsMakerLogo size={miniSidenav ? 36 : 64} />
          </MDBox>

          {/* 3. 로고 옆이 아니라 로고 '아래'에 글자가 나오게 하거나, 글자를 지우고 싶으면 이 MDBox를 삭제하세요. */}
          <MDBox
            width="100%"
            textAlign="center"
            mt={0.5} // 로고와 글자 사이 간격
            display={miniSidenav ? "none" : "block"} // 사이드바 접혔을 땐 글자 숨김
          >
            <MDTypography 
              component="h6" 
              variant="button" 
              fontWeight="bold" 
              color={textColor}
              sx={{
                fontSize: "0.95rem",
                letterSpacing: "0.2px",
                opacity: 0.95
              }}
            >
              {brandName || "콘텐츠메이커 스튜디오"}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
