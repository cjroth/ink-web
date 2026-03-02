import { useState } from "react";
import { Box, useInput } from "ink";
import { Ascii } from "@ink-ui/ascii/ascii";
import { Gradient } from "@ink-ui/gradient/gradient";
import { Modal } from "@ink-ui/modal/modal";
import { ChatPanel, type ChatMessage } from "@ink-ui/chat/chat";
import { StatusBar } from "@ink-ui/status-bar/status-bar";

interface AppProps {
  onQuit?: () => void;
}

export default function App({ onQuit }: AppProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useInput((input, key) => {
    if (isModalOpen) {
      if (key.escape) setIsModalOpen(false);
      return;
    }
    if (input === "m") setIsModalOpen(true);
    if (input === "q") onQuit?.();
  });

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    const replyMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `You said: "${text}"`,
    };
    setMessages((prev) => [...prev, userMsg, replyMsg]);
  };

  if (isModalOpen) {
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Modal title="Chat" onClose={() => setIsModalOpen(false)}>
          <ChatPanel messages={messages} onSendMessage={handleSend} />
        </Modal>
        <StatusBar items={[{ key: "Esc", label: "close" }]} />
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
    >
      <Gradient name="rainbow">
        <Ascii text="ink-web" />
      </Gradient>
      <Box marginTop={1}>
        <StatusBar
          items={[
            { key: "m", label: "open modal" },
            { key: "q", label: "quit" },
          ]}
        />
      </Box>
    </Box>
  );
}
