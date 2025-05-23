import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface Props {
  children: any;
  width?: any;
}

const Reveal = ({ children, width = "fit-content" }: Props) => {
  const ref = useRef(null);
  const isInVIew = useInView(ref, { once: true });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInVIew) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInVIew]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {children}
      </motion.div>

      {/* CROOSING DIV */}
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn", delay: 0.25 }}
        className="absolute bottom-1 left-0 right-0 top-1 z-20 bg-primary-500"
      ></motion.div>
    </div>
  );
};

export default Reveal;
