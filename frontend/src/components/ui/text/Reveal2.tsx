import { motion } from "framer-motion";
import React from "react";

// Spliting Text Function
function splitText(inputString: string): string[] {
  const characters: string[] = [];
  const regex = /[\s\S]/gu;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(inputString)) !== null) {
    characters.push(match[0]);
  }

  return characters;
}

interface Reveal2Props {
  children: string;
  duration?: number;
}

const Reveal2: React.FC<Reveal2Props> = ({ children, duration = 0.5 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="reveal"
      transition={{ staggerChildren: 0.02, delayChildren: 1 }}
    >
      {splitText(children).map((char, idx) => (
        <motion.span
          key={idx}
          variants={{
            hidden: { opacity: 0 },
            reveal: { opacity: 1 },
          }}
          transition={{ duration, ease: "easeInOut" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default Reveal2;
