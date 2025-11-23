"use client";

import { InkWebDynamic } from "ink-web/next";
import dynamic from "next/dynamic";

const Terminal = dynamic(() => import("./terminal"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />
  ),
});

export default function Home() {
  return (
    <>
      <Terminal />
      <InkWebDynamic focus>
        {({ Box, Text }) => (
          <Box>
            <Text>Rendered with InkWebDynamic.</Text>
          </Box>
        )}
      </InkWebDynamic>
    </>
  );
}
