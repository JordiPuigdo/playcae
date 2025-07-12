import { useState, useEffect } from "react";

export function useAvailableHeight(headerHeight = 80) {
  const [availableHeight, setAvailableHeight] = useState(
    window.innerHeight - headerHeight
  );

  useEffect(() => {
    function handleResize() {
      setAvailableHeight(window.innerHeight - headerHeight);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [headerHeight]);

  return availableHeight;
}
