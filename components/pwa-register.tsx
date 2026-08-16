"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "CUK Store Service Worker registered:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error(
            "CUK Store Service Worker registration failed:",
            error
          );
        });
    }
  }, []);

  return null;
}