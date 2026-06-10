/**
 * HTTPS의 navigator.clipboard가 작동하지 않는 비보안 HTTP 환경에서도
 * 클립보드 텍스트 복사가 가능하도록 textarea를 활용하는 Fallback(대체) 복사 헬퍼입니다.
 */
export const copyText = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for non-secure HTTP contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // 화면 레이아웃 깨짐 및 스크롤 튀는 현상 방지
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (!successful) {
        throw new Error("Fallback copy command failed");
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
};
