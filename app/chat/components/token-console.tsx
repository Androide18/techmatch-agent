"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface TokenData {
  validation?: TokenUsage;
  summary?: TokenUsage;
}

interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  totalTokens: number;
}

interface TokenConsoleProps {
  tokensUsed?: TokenData | null;
  tokenSearchUsed?: TokenUsage | null;
}

export function TokenConsole({
  tokensUsed,
  tokenSearchUsed,
}: TokenConsoleProps) {
  const [open, setOpen] = useState(false);

  const totalTokens =
    (tokensUsed?.validation?.totalTokens ?? 0) +
    (tokensUsed?.summary?.totalTokens ?? 0) +
    (tokenSearchUsed?.totalTokens ?? 0);

  const totalInputTokens =
    (tokensUsed?.validation?.inputTokens ?? 0) +
    (tokensUsed?.summary?.inputTokens ?? 0) +
    (tokenSearchUsed?.inputTokens ?? 0);

  const totalOutputTokens =
    (tokensUsed?.validation?.outputTokens ?? 0) +
    (tokensUsed?.summary?.outputTokens ?? 0) +
    (tokenSearchUsed?.outputTokens ?? 0);

  const totalReasoningTokens =
    (tokensUsed?.validation?.reasoningTokens ?? 0) +
    (tokensUsed?.summary?.reasoningTokens ?? 0) +
    (tokenSearchUsed?.reasoningTokens ?? 0);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Bubble */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-primary hover:bg-primary/80 text-black font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition"
        title="Token Usage Console"
      >
        {open ? "T" : "T"}
      </button>

      {/* Expandable Console */}
      <motion.div
        animate={{
          opacity: open ? 1 : 0,
          height: open ? "auto" : 0,
          y: 0,
          pointerEvents: open ? "auto" : "none",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="overflow-hidden mt-2 w-80 max-w-xs bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-white">Token Usage</h4>
          </div>

          {tokensUsed || tokenSearchUsed ? (
            <>
              <p>
                <span className="font-medium">Input:</span>{" "}
                {totalInputTokens ?? 0} tokens
              </p>
              <p>
                <span className="font-medium">Output:</span>{" "}
                {totalOutputTokens ?? 0} tokens
              </p>
              <p>
                <span className="font-medium">Reasoning:</span>{" "}
                {totalReasoningTokens ?? 0} tokens
              </p>
              <p className="border-t border-gray-700 pt-2">
                <span className="font-medium">Total:</span> {totalTokens} tokens
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No token data yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
