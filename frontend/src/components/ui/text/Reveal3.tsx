import { useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
interface Props {
  children: any;
}

const Reveal3 = ({ children }: Props) => {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ["start 0.9", "start 0.50"],
  });
  useEffect(() => {
    scrollYProgress.on("change", (e) => console.log(e));
  }, []);

  const words = children.split(" ");

  return (
    <motion.span
      ref={element}
      style={{ opacity: scrollYProgress }}
      className={`flex flex-wrap`}
    >
      {words.map((word: any, i: any) => (
        <Word key={i}>{word}</Word>
      ))}
    </motion.span>
  );
};
export default Reveal3;

// WORD COMPONENT
const Word = ({ children }: Props) => {
  return <span className="mr-1">{children}</span>;
};
