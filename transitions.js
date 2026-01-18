// Fade in when page loads
window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-leaving");
});

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");

  // Ignore external links, anchors, new tabs, downloads
  if (!href) return;
  if (href.startsWith("#")) return;
  if (link.target === "_blank") return;
  if (link.hasAttribute("download")) return;
  if (href.startsWith("http")) return;

  e.preventDefault();

  // Fade out then navigate
  document.body.classList.add("is-leaving");
  setTimeout(() => {
    window.location.href = href;
  }, 250);
});
