import { useState, useEffect } from "react";

const useResize = () => {
  const [resized, setResized] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", () => setResized(true));
  }, []);

  return resized;
};

export default useResize;
