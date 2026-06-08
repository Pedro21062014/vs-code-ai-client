import React from 'react'
import { motion } from 'framer-motion'

function ThinkingAnimation() {
  return (
    <div className="flex items-center gap-3">
      {/* Pulsing Dots */}
      <div className="thinking-dots flex items-center gap-1">
        <motion.span
          animate={{ 
            scale: [0.6, 1, 0.6],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-vscode-accent to-vscode-success"
        />
        <motion.span
          animate={{ 
            scale: [0.6, 1, 0.6],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-vscode-success to-vscode-warning"
        />
        <motion.span
          animate={{ 
            scale: [0.6, 1, 0.6],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-vscode-warning to-vscode-accent"
        />
      </div>

      {/* Wave Animation */}
      <div className="wave-container flex items-center gap-0.5 h-6">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            animate={{
              height: [8, 24, 8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </div>

      {/* Brain Icon Animation */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-2xl"
      >
        🧠
      </motion.div>
    </div>
  )
}

export default ThinkingAnimation