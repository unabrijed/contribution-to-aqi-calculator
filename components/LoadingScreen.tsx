"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  "Initializing WHO algorithms...",
  "Analyzing smoke sources...",
  "Calculating daily PM2.5 intake...",
  "Cross-referencing brand data...",
  "Aggregating annual exposure...",
  "Finalizing...",
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Pick a random buffer time between 4000 and 10000 ms.
    const bufferTime = Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
    
    const timeout = setTimeout(() => {
      onComplete();
    }, bufferTime);

    // Cycle through messages periodically
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-sm mb-10">
          <Loader2 className="h-10 w-10 text-ember-500 animate-spin" />
        </div>

        <div className="h-8 relative w-full flex justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={messageIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-display font-medium text-ink-100 absolute whitespace-nowrap"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-64 h-1.5 bg-[var(--surface-2)] rounded-full mt-8 overflow-hidden relative"
        >
          <motion.div 
            className="absolute top-0 bottom-0 bg-gradient-to-r from-ember-600 to-ember-400 w-1/3 rounded-full"
            animate={{ 
              left: ["-33%", "100%"] 
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
