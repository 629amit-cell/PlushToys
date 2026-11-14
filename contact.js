const form = document.querySelector("#contact-form");
const status = document.querySelector("#contact-form-status");
const supportEmail =
  (window.PLUSH_STORY_CONFIG && window.PLUSH_STORY_CONFIG.supportEmail) ||
  "support@plushstory.shop";

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const order = String(data.get("order") || "").trim();
    const topic = String(data.get("topic") || "General question");
    const message = String(data.get("message") || "").trim();
    const subject = `[Plush Story] ${topic}${order ? ` — ${order}` : ""}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      order ? `Order number: ${order}` : "",
      `Topic: ${topic}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    status.textContent = "Opening your email app with this message ready to send…";
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      status.textContent = `If your email app did not open, email us directly at ${supportEmail}.`;
    }, 1200);
  });
}
