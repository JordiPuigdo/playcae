import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface LoaderProps {
  text?: string;
}

const Loader = ({ text }: LoaderProps) => {
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = useMemo(
    () => [
      t("loading.message1"),
      t("loading.message2"),
      t("loading.message3"),
      t("loading.message4"),
    ],
    [t]
  );

  useEffect(() => {
    if (text) return; // Si hay texto custom, no rotar

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [loadingMessages.length, text]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {text || loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export default Loader;
