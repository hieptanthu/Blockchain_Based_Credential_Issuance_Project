import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

// Define prop types properly in TypeScript
interface PageScrollProps {
  title: string;
  path1: string;
  path2: string;
}

const PageScroll = ({ title, path1, path2 }: PageScrollProps) => {
  const textRef = useRef<HTMLDivElement>(null); // Ref for the section element
  const isInView = useInView(textRef, { once: true }); // Hook to check if the element is in view
  const mainControls = useAnimation();
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start end", "end end"], // Scroll offset configuration
  });

  // Start animation when the element is in view
  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]); // Add proper dependency array

  const paragraphOneValue = useTransform(
    scrollYProgress,
    [0, 1],
    ["-100%", "0%"],
  );

  const paragraphTwoValue = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"],
  );

  return (
    <main>
      <section ref={textRef} className="mb-10 flex flex-col gap-10">
        <motion.h1
          animate={mainControls}
          initial="hidden"
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="text-center text-5xl tracking-wide text-shade-100"
        >
          {title} {/* Use dynamic prop for the header */}
        </motion.h1>

        <motion.p
          style={{ translateX: paragraphOneValue }}
          className="mx-auto text-xl font-thin text-shade-100"
        >
          {path1} {/* Use dynamic prop for the first paragraph */}
        </motion.p>
        <motion.p
          style={{ translateX: paragraphTwoValue }}
          className="mx-auto text-xl font-thin text-shade-100"
        >
          {path2} {/* Use dynamic prop for the second paragraph */}
        </motion.p>
      </section>
    </main>
  );
};

export default PageScroll;
