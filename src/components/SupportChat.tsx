import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/Sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy tu asistente de soporte. ¿En qué puedo ayudarte hoy?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Simple response simulation based on keywords
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("empresa") || lowerMessage.includes("company")) {
      return 'Te puedo ayudar con la gestión de empresas. Puedes crear, editar y ver los detalles de las empresas desde la sección "Empresas" en el menú principal.';
    } else if (
      lowerMessage.includes("trabajador") ||
      lowerMessage.includes("worker")
    ) {
      return 'Para gestionar trabajadores, ve a la sección "Trabajadores" donde podrás añadir nuevos trabajadores, editar información existente y gestionar sus documentos.';
    } else if (
      lowerMessage.includes("documento") ||
      lowerMessage.includes("document")
    ) {
      return "Los documentos se pueden subir y gestionar tanto a nivel de empresa como de trabajador. Asegúrate de que todos los documentos estén actualizados para mantener el cumplimiento.";
    } else if (
      lowerMessage.includes("ayuda") ||
      lowerMessage.includes("help")
    ) {
      return "Estoy aquí para ayudarte con el Sistema CAE. Puedo asistirte con empresas, trabajadores, documentos y navegación general. ¿Qué necesitas específicamente?";
    } else {
      return "Entiendo tu consulta. Te recomiendo revisar las diferentes secciones del sistema o contactar con el administrador si necesitas ayuda específica con alguna funcionalidad.";
    }
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

    try {
      const aiResponse = await simulateAIResponse(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  return (
    <>
      {/* Floating Chat Bubble */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Abrir chat de soporte</span>
      </Button>

      {/* Chat Interface */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-96 sm:max-w-96 p-0 flex flex-col"
        >
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <SheetTitle>Soporte CAE</SheetTitle>
                  <p className="text-xs text-muted-foreground">
                    Asistente virtual
                  </p>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}

                  <Card
                    className={`max-w-[75%] p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </Card>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="flex-shrink-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <Card className="p-3 bg-card">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Escribiendo...
                      </span>
                    </div>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Presiona Enter para enviar
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
