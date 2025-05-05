import { useTranslation } from "react-i18next";

const TermsOfUsePage = () => {
  const { t } = useTranslation();

  const sections = [
    "acceptance",
    "modification",
    "account",
    "user_rights",
    "ownership",
    "payment",
    "liability",
    "third_party",
    "suspension",
    "general",
    "contact",
  ];

  return (
    <div className="container py-10">
      <h1>{t("terms_of_use.title")}</h1>
      <p>
        <em>{t("terms_of_use.last_updated", { date: "05/05/2025" })}</em>
      </p>

      <p
        dangerouslySetInnerHTML={{
          __html: t("terms_of_use.intro", { site_name: "TenWebsite" }),
        }}
      />

      {sections.map((key) => (
        <section key={key} className="my-4">
          <h2>{t(`terms_of_use.sections.${key}.title`)}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: t(`terms_of_use.sections.${key}.content`, {
                company_name: "Công ty ABC",
                email: "hotro@abc.com",
                phone: "1900 9999",
                address: "123 Đường ABC, Quận 1, TP.HCM",
              }),
            }}
          />
        </section>
      ))}
    </div>
  );
};

export default TermsOfUsePage;
