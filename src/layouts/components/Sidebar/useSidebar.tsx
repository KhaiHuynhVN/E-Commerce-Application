import { useState, useEffect } from "react";

const useSidebar = () => {
  // Collapsed state: Desktop mặc định expand, Mobile mặc định collapse
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check local storage
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      return saved === "true";
    }

    // Default: collapse on mobile (<768px), expand on desktop
    return window.innerWidth < 768;
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return {
    isCollapsed,
    toggleSidebar,
  };
};

export default useSidebar;
