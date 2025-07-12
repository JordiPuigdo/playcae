"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/Scroll-Area";
import { useAvailableHeight } from "@/hooks/useResponsive";
import { Separator } from "@radix-ui/react-select";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
}

const documentCategories = [
  { id: "company-docs", name: "Documentos de Empresa", count: 23 },
  { id: "worker-docs", name: "Documentos de Trabajadores", count: 156 },
  { id: "safety-docs", name: "Documentos de Seguridad", count: 45 },
  { id: "compliance", name: "Cumplimiento Legal", count: 12 },
];

const AuditPage = () => {
  const availableHeight = useAvailableHeight(120);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<string>("new-chat");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const simulateAIStreaming = async (userMessage: string) => {
    const responses = [
      "Entiendo tu consulta sobre el sistema CAE. ",
      "Basándome en la información disponible, ",
      "puedo ayudarte con la gestión de documentos y trabajadores. ",
      "¿Hay algún aspecto específico que te gustaría explorar más a fondo?",
    ];
    console.log(userMessage);

    let fullResponse = "";

    for (const chunk of responses) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      fullResponse += chunk;
      setStreamingMessage(fullResponse);
    }

    return fullResponse;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const aiResponse = await simulateAIStreaming(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title:
          messages[0]?.content.slice(0, 30) + "..." || "Nueva conversación",
        messages: [...messages],
        lastActivity: new Date(),
      };
      setChatSessions((prev) => [newSession, ...prev]);
    }
    setMessages([]);
    setCurrentSession("new-chat");
  };

  const loadChatSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSession(session.id);
  };

  return (
    <div
      className="flex flex-1 bg-background"
      style={{ height: availableHeight }}
    >
      {/* Sidebar */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Asistente IA CAE</h2>
          <Button
            onClick={startNewChat}
            className="w-full mb-4"
            variant="outline"
          >
            Nueva Conversación
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Document Categories */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Categorías de Documentos
              </h3>
              <div className="space-y-2">
                {documentCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Previous Chats */}
            {chatSessions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Conversaciones Anteriores
                </h3>
                <div className="space-y-2">
                  {chatSessions.map((session) => (
                    <Card
                      key={session.id}
                      className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                        currentSession === session.id ? "bg-muted" : ""
                      }`}
                      onClick={() => loadChatSession(session)}
                    >
                      <div className="text-sm font-medium truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {session.lastActivity.toLocaleDateString()}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <h1 className="text-xl font-semibold">Asistente IA - Sistema CAE</h1>
          <p className="text-sm text-muted-foreground">
            Pregúntame sobre empresas, trabajadores, documentos y más
          </p>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && !streamingMessage && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  ¡Hola! Soy tu asistente IA
                </h3>
                <p className="text-muted-foreground">
                  Puedo ayudarte con información sobre empresas, trabajadores,
                  documentos y cumplimiento legal. ¿En qué puedo asistirte hoy?
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                <Card
                  className={`max-w-[70%] p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className={`text-xs mt-2 opacity-70`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </Card>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Streaming Message */}
            {streamingMessage && (
              <div className="flex items-start gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <Card className="max-w-[70%] p-4 bg-card">
                  <p className="text-sm whitespace-pre-wrap">
                    {streamingMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs opacity-70">Escribiendo...</span>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Presiona Enter para enviar • Shift + Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
