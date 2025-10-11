import {useEffect, useState} from "react";
import Vapi from "@vapi-ai/web";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export function useVapi() {
  const [vapi, setVapi] = useState<Vapi | null>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // only for testing Vapi
    const vapiInstance = new Vapi("")
    setVapi(vapiInstance)

    vapiInstance.on("call-start", () => {
      setIsConnected(true)
      setIsConnecting(false)
      setTranscript([])
    })

    vapiInstance.on("call-end", () => {
      setIsConnected(false)
      setIsConnecting(false)
      setIsSpeaking(false)
    })

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(true)
    })

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false)
    })

    vapiInstance.on("error", (error) => {
      console.error("VAPI ERROR", error)
      setIsConnecting(false)
    })

    vapiInstance.on("message", (message) => {
      if(message.type === "transcript" && message.transcriptType === "final") {
        setTranscript(prev => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          }
        ])
      }
    })

    return () => {
      vapiInstance?.stop()
    }
  }, [])

  const startCall = () => {
    setIsConnecting(true)

    if(vapi) {
      // only for testing Vapi
      vapi.start("");
    }
  }

  const endCall = () => {
    if(vapi) {
      vapi.stop()
    }
  }

  return {
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall
  }
}
