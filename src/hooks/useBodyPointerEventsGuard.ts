import { useEffect } from "react";

export function useBodyPointerEventsGuard() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;

    const release = () => {
      if (body.style.pointerEvents !== "none") return;
      const overlayOpen =
        document.querySelector('[role="dialog"][data-state="open"]') ||
        document.querySelector('[role="alertdialog"][data-state="open"]') ||
        document.querySelector("[data-radix-popper-content-wrapper]");
      if (!overlayOpen) {
        body.style.pointerEvents = "";
      }
    };

    const observer = new MutationObserver(() => {
      window.setTimeout(release, 300);
    });
    observer.observe(body, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, []);
}
