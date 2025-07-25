import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

const Loader = ({ text }: LoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;
