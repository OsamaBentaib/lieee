import React, { useEffect, useRef } from "react";
import useMousePosition from "./hooks/useMousePosition";
import { gsap } from "gsap";
export default function Cursor() {
  const mouse = useMousePosition();
  const cursor = useRef(null);
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    if (cursor) {
      cursor.current.style.opacity = 0;
    }
  };
  useEffect(() => {
    onMouseMoveEv();
  }, [mouse]);
  const onMouseMoveEv = () => {
    if (cursor) {
      gsap.to(cursor.current, {
        duration: 0.9,
        ease: "Power3.easeOut",
        opacity: 1,
        left: mouse.x - 25,
        top: mouse.y - 19,
      });
    }
  };
  return (
    <svg
      className="cursor"
      ref={cursor}
      width="80"
      height="80"
      viewBox="0 0 80 80"
    >
      <circle className="cursor__inner" cx="40" cy="40" r="20"></circle>
    </svg>
  );
}
