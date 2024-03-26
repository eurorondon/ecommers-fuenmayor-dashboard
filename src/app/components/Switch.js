import React from "react";
import { motion } from "framer-motion";

export default function Switch({ toggle, setToggle }) {
  return (
    <div
      onClick={() => setToggle(!toggle)}
      className={`flex h-6  w-12 cursor-pointer  rounded-full border border-black p-[1px] ${
        toggle ? "bg-white justify-start" : "bg-black justify-end"
      }`}
    >
      <motion.div
        className={`h-5 w-5 rounded-full bg-black ${
          toggle ? "bg-black" : "bg-white"
        }`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  );
}
