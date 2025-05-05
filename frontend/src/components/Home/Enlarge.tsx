import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface EnlargeProps {
  item: any;
}
const Enlarge = ({ item }: EnlargeProps) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.8], [0.1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="min-h-80 w-full rounded px-4 py-3"
    >
      <section
        className="min-h-80 w-full rounded bg-amber-50 px-4 py-3 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${item.img})` }}
      >
        <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg glow-animation">
          {item.text}
        </h1>
      </section>
    </motion.div>
  );
};
export default Enlarge;
