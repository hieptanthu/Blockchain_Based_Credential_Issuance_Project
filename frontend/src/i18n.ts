import i18n from "i18next";
import { initReactI18next } from "react-i18next"; // Kết nối i18next với React
import HttpBackend from "i18next-http-backend"; // Tải tài nguyên ngôn ngữ từ file
import LanguageDetector from "i18next-browser-languagedetector"; // Phát hiện ngôn ngữ của người dùng

i18n
  .use(initReactI18next) // Kết nối i18next với React
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en", // Ngôn ngữ mặc định khi không có ngôn ngữ phù hợp
    debug: true,
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Đường dẫn đến các file ngôn ngữ
    },
    interpolation: {
      escapeValue: false, // React đã xử lý việc escape HTML
    },
  });

export default i18n;
