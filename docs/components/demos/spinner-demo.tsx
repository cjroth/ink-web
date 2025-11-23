"use client";

import { InkWeb, Box, Text } from "ink-web/bundled";
import "ink-web/bundled/css";
import { useEffect, useState } from "react";

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const Spinner = ({ text = 'Thinking', color = 'gray' }: { text?: string; color?: string }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <Text color={color}>{frames[frame]} {text}</Text>;
};

export default function SpinnerDemo() {
  return (
    <InkWeb>
      <Box flexDirection="column">
        <Spinner />
      </Box>
    </InkWeb>
  );
}
