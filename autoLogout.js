"use client"
import React, { useRef } from "react";
import { IdleTimerProvider } from "react-idle-timer";

export default function IdleTimeContainer({ children, onIdle }) {
  const idleTimerRef = useRef(null);

  const handleIdle = () => {
    console.log("🚨 User is idle");
    if (onIdle) onIdle();
  };

  const handleActive = () => {
    console.log("✅ User is active");
  };

  const handleAction = () => {
    console.log("👋 User did something");
  };

  return (
    <IdleTimerProvider
      ref={idleTimerRef}
      timeout={1000 * 60 * 60 * 1} // 2 hours
      // timeout={10 * 60 } 
      onIdle={handleIdle}
      onActive={handleActive}
      onAction={handleAction}
      debounce={500}
    >
      {children}
    </IdleTimerProvider>
  );
}
