import React from "react";
import { useTranslation } from "react-i18next";
import { path } from "../routers";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className=" rounded-lg shadow-sm m-4 mt-10">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Degree Chain
          </a>
          . {t("footer.rights")}
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium   sm:mt-0">
          <li>
            <Link to="#" className="hover:underline me-4 md:me-6">
              {t("footer.about")}
            </Link>
          </li>
          <li>
            <Link to={path.Clause} className="hover:underline me-4 md:me-6">
              {t("footer.clause")}
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:underline me-4 md:me-6">
              {t("footer.licensing")}
            </Link>
          </li>
          <li>
            <Link to={path.Contact} className="hover:underline">
              {t("footer.contact")}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
