import Flip from "../components/ui/text/Flip";
import { useTranslation } from "react-i18next";
import Reveal2 from "../components/ui/text/Reveal2";
import PageScroll from "../components/Home/PageScroll";
import AuroraGrad from "../components/Home/AuroraGrad";
function Home() {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <section className="flex flex-col t min-h-full items-center mt-[10px] justify-center mx-3 my-10">
          <article className="space-y-4 mt-9">
            {["Degree", "Chain"].map((item) => (
              <Flip key={item}>{item}</Flip>
            ))}
          </article>
          <article className="flex  flex-col items-start justify-center gap-2 m-3 max-w-screen">
            <Reveal2>{t("home.text-explain")}</Reveal2>
          </article>
        </section>

        <div>
          <PageScroll
            title={"ddd"}
            path1={t("home.text-explain")}
            path2={t("home.text-explain")}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
