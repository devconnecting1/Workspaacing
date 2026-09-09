import * as React from "react";

export function useVisualViewport() {
  const [height, setHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    const visualViewport = window.visualViewport;

    if (!visualViewport) {
      return;
    }

    const updateHeight = () => {
      setHeight(Math.round(visualViewport.height));
    };

    updateHeight();
    visualViewport.addEventListener("resize", updateHeight);
    visualViewport.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);

    return () => {
      visualViewport.removeEventListener("resize", updateHeight);
      visualViewport.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return height;
}
