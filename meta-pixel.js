(function () {
  "use strict";

  var config = window.PLUSH_STORY_CONFIG || {};
  var pixelId = String(config.metaPixelId || "").trim();
  var pixelRequested = false;

  function track(eventName, parameters) {
    if (!pixelId || typeof window.fbq !== "function") return;
    window.fbq("track", eventName, parameters || {});
  }

  window.PlushStoryTracking = { track: track };

  if (!pixelId) return;

  // Queue events immediately, but keep the Meta SDK off the critical path.
  // This protects Core Web Vitals while still recording the first page view.
  if (typeof window.fbq !== "function") {
    var fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
  }

  function loadPixel() {
    if (pixelRequested) return;
    pixelRequested = true;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  function schedulePixel() {
    window.setTimeout(loadPixel, 2500);
  }

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");

  if (document.readyState === "complete") {
    schedulePixel();
  } else {
    window.addEventListener("load", schedulePixel, { once: true });
  }

  ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
    window.addEventListener(eventName, loadPixel, { once: true, passive: true });
  });
})();
