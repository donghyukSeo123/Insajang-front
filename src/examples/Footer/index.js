/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import PropTypes from "prop-types";

// @mui material components
import Link from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

function Footer({ company, links }) {
  const { name } = company;
  const { size } = typography;

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      py={2} // 상하 여백 살짝 부여
    >
      {/* 좌측: 저작권 표시 영역 */}
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()}&nbsp;
        <MDTypography variant="button" fontWeight="medium" sx={{ fontSize: size.sm, color: "#344767" }}>
          {name}
        </MDTypography>
        &nbsp;. All rights reserved.
      </MDBox>

      {/* 우측: 핵심 링크 영역 (이용약관, 고객지원 등 포트폴리오용 구성) */}
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 2,
          mb: 0,
          p: 0,
          gap: 3, // 링크 간격 조절

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        {links.map((link) => (
          <MDBox component="li" key={link.name} lineHeight={1}>
            <Link href={link.href}>
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ 
                  fontSize: size.sm,
                  "&:hover": { color: "#1A73E8 !important" } // 마우스 오버 시 브랜드 컬러 하이라이트
                }}
              >
                {link.name}
              </MDTypography>
            </Link>
          </MDBox>
        ))}
      </MDBox>
    </MDBox>
  );
}

// [💡 수정] 포트폴리오 및 실제 서비스에 맞게 Default Props 수정
Footer.defaultProps = {
  company: { href: "#", name: "컨텐츠메이커스튜디오" },
  links: [
    { href: "#", name: "이용약관" },
    { href: "#", name: "개인정보처리방침" },
    { href: "#", name: "고객센터" },
  ],
};

Footer.propTypes = {
  company: PropTypes.shape({
    href: PropTypes.string,
    name: PropTypes.string,
  }),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default Footer;