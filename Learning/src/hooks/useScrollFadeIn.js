import { useEffect, useRef, useState } from "react";

const useScrollFadeIn = (direction = "up", duration = 1, delay = 0) => {
  const elementRef = useRef();
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    const { current } = elementRef;
    if (current) {
      const { top } = current.getBoundingClientRect();
      const isVisible = top < window.innerHeight * 0.8;
      if (isVisible) setVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getTransform = (direction) => {
    switch (direction) {
      case "up":
        return "translateY(20px)";
      case "down":
        return "translateY(-20px)";
      case "left":
        return "translateX(20px)";
      case "right":
        return "translateX(-20px)";
      default:
        return "translateY(20px)";
    }
  };

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translate(0, 0)" : getTransform(direction),
    transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
  };

  return {
    ref: elementRef,
    style,
  };
};

export default useScrollFadeIn;
