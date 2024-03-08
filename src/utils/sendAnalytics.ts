export function sendAnalytics(eventName: string, eventData = {}) {
  fetch("https://prod.api.12-px.com/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: window.location.href,
      name: eventName,
      data: eventData,
    }),
  });
}
