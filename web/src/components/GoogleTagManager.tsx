"use client";

import { useEffect } from "react";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export function GoogleTagManager() {
  useEffect(() => {
    if (!GTM_ID) {
      return;
    }

    // GTM script is loaded via the script tag in head
    // This component just ensures GTM is initialized
  }, []);

  if (!GTM_ID) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager (noscript) - Added in body */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
