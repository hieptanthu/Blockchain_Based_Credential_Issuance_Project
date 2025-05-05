import Flip from "../components/ui/text/Flip";
import { useTranslation } from "react-i18next";
import Reveal2 from "../components/ui/text/Reveal2";
import PageScroll from "../components/Home/PageScroll";
import { Fragment } from "react/jsx-runtime";
import Enlarge from "../components/Home/Enlarge";
import { connectBlock, userChan, web3 } from "../assets/image";
import ContactForm from "../components/Home/Contact";

function Home() {
  const { t } = useTranslation();
  const listImgBlockChan = [
    { text: t("home.listImg.safety"), img: connectBlock },
    { text: t("home.listImg.transparency"), img: userChan },
    { text: t("home.listImg.web3"), img: web3 },
  ];
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
          <div className={`space-y-4`}>
            {listImgBlockChan.map((item, index) => (
              <Fragment key={index}>
                <Enlarge item={item}></Enlarge>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="mt-11">
          <PageScroll
            title={t("home.us.title")}
            path1={t("home.us.Mission")}
            path2={t("home.us.Vision")}
          />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </>
  );
}

export default Home;
