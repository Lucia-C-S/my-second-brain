const filterButtons = document.querySelectorAll(".filter-button");
const timelineEntries = document.querySelectorAll(".timeline-entry");
const emptyMessage = document.querySelector(".filter-empty");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    timelineEntries.forEach((entry) => {
      const isVisible = filter === "all" || entry.dataset.category === filter;
      entry.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount > 0;
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  sidebar.classList.toggle("is-open", !isExpanded);
});

document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const sectionLinks = document.querySelectorAll('.side-nav a[href^="#"]');
const sections = [...sectionLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  sections.forEach((section) => observer.observe(section));
}