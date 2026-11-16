(function () {
  "use strict";

  var config = window.PLUSH_STORY_CONFIG || {};
  var pixelId = String(config.metaPixelId || "").trim();
  var pixelRequested = false;
  var SERVER_EVENTS = {
    PageView: true,
    ViewContent: true,
    AddToCart: true,
    InitiateCheckout: true,
  };

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
  }

  function makeEventId(eventName) {
    var prefix = String(eventName || "event")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 30);
    return "ps_" + (prefix || "event") + "_" + randomId();
  }

  function readCookie(name) {
    var cookies = document.cookie ? document.cookie.split(";") : [];
    for (var index = 0; index < cookies.length; index += 1) {
      var part = cookies[index];
      var separator = part.indexOf("=");
      if (separator < 0) continue;
      if (part.slice(0, separator).trim() !== name) continue;
      try {
        return decodeURIComponent(part.slice(separator + 1).trim());
      } catch {
        return "";
      }
    }
    return "";
  }

  function safeFbCookie(value) {
    var cookie = String(value || "").trim();
    return /^fb\.\d+\.\d+\.[A-Za-z0-9._-]+$/.test(cookie) ? cookie : "";
  }

  function getFbc() {
    var cookie = safeFbCookie(readCookie("_fbc"));
    if (cookie) return cookie;
    try {
      var fbclid = new URLSearchParams(window.location.search).get("fbclid") || "";
      if (!/^[A-Za-z0-9._-]{1,500}$/.test(fbclid)) return "";
      return "fb.1." + Date.now() + "." + fbclid;
    } catch {
      return "";
    }
  }

  function sendServerEvent(eventName, parameters, eventId) {
    if (!SERVER_EVENTS[eventName] || typeof window.fetch !== "function") return;

    try {
      window.fetch("/api/meta-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          custom_data: parameters || {},
          fbp: readCookie("_fbp"),
          fbc: getFbc(),
        }),
        credentials: "same-origin",
        keepalive: true,
      }).catch(function () {
        // The browser Pixel remains the fallback if server tracking is unavailable.
      });
    } catch {
      // Never let tracking interfere with shopping.
    }
  }

  function track(eventName, parameters, options) {
    if (!pixelId || typeof window.fbq !== "function") return "";
    var settings = options || {};
    var eventId = String(settings.eventID || "").trim() || makeEventId(eventName);

    window.fbq("track", eventName, parameters || {}, { eventID: eventId });

    if (settings.server !== false && SERVER_EVENTS[eventName]) {
      sendServerEvent(eventName, parameters || {}, eventId);
    }

    return eventId;
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
  track("PageView");

  if (document.readyState === "complete") {
    schedulePixel();
  } else {
    window.addEventListener("load", schedulePixel, { once: true });
  }

  ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
    window.addEventListener(eventName, loadPixel, { once: true, passive: true });
  });
})();
