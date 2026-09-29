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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".section-heading, .gallery-frame, .archive-caption, .motion-tile, .motion-note, .timeline-entry, .project-card, .learning-note, .ledger-row, .field-item, .recognition-list article, .contact-section > .eyebrow, .contact-section > h2, .contact-copy, .contact-button"
);

if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  revealTargets.forEach((target) => {
    const siblings = [...target.parentElement.children];
    const index = siblings.indexOf(target);
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const archiveVideos = [...document.querySelectorAll(".archive-video")];
const videoButtons = document.querySelectorAll("[data-video-toggle]");

function updateVideoButton(video) {
  const button = document.querySelector(`[aria-controls="${video.id}"]`);
  if (!button) return;

  const isPlaying = !video.paused;
  button.setAttribute("aria-pressed", String(isPlaying));
  button.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${button.dataset.videoName}`);
  button.querySelector("span").textContent = isPlaying ? "Ⅱ" : "▶";
}

archiveVideos.forEach((video) => {
  video.addEventListener("play", () => updateVideoButton(video));
  video.addEventListener("pause", () => updateVideoButton(video));
});

videoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const video = document.getElementById(button.getAttribute("aria-controls"));
    if (video.paused) {
      delete video.dataset.userPaused;
      video.play().catch(() => {});
    } else {
      video.dataset.userPaused = "true";
      video.pause();
    }
  });
});

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (!entry.isIntersecting || document.visibilityState !== "visible") {
        video.pause();
      } else if (!reduceMotion && !video.dataset.userPaused) {
        video.play().catch(() => {});
      }
    });
  }, { threshold: 0.4 });

  archiveVideos.forEach((video) => videoObserver.observe(video));
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    archiveVideos.forEach((video) => video.pause());
  }
});

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();