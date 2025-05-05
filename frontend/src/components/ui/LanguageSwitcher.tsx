import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { GlobeIcon } from "@radix-ui/react-icons";

type Language = {
  code: string;
  label: string;
  flag: string;
};

const languages: Language[] = [
  { code: "en", label: "English", flag: "gb" },
  { code: "vi", label: "Tiếng Việt", flag: "vn" },
  // Thêm các ngôn ngữ khác nếu cần
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <GlobeIcon
        className="size-10 mb-[-16px] ml-1"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className=" origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg z-100 bg-white ring-1 text-black ring-black ring-opacity-5">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm  text-black ${
                  i18n.language === lang.code ? "bg-gray-500 font-semibold" : ""
                } hover:bg-gray-100`}
              >
                <span className={`fi fi-${lang.flag} mr-2`}></span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
