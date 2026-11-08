"use client"

import * as React from "react"

export function PwaRegister() {
  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.location.protocol === "https:" || window.location.hostname === "localhost") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope)
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err)
        })
    }
  }, [])

  return null
}
