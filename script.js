const guideTabs = document.querySelectorAll(".guide-nav [data-view]");
const guidePanels = document.querySelectorAll(".guide-panel");
const topTabs = document.querySelectorAll("[data-open-view]");

/* 四套方案互斥展示，避免将不同目的地误读为同一次旅行的连续安排。 */
function switchGuide(view) {
  if (!Array.from(guidePanels).some((panel) => panel.dataset.panel === view)) return;
  guideTabs.forEach((tab) => {
    const selected = tab.dataset.view === view;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  });
  guidePanels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== view;
  });
}

guideTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchGuide(tab.dataset.view));
  /* 用方向键切换明信片页签，让键盘用户也能直接比较四套方案。 */
  tab.addEventListener("keydown", (event) => {
    const items = Array.from(guideTabs);
    const current = items.indexOf(tab);
    let next;
    if (event.key === "ArrowRight") next = (current + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    switchGuide(items[next].dataset.view);
    items[next].focus();
  });
});

topTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchGuide(tab.dataset.openView);
    /* 页内链接保留自己的锚点目标，顶部按钮才统一滚动到方案页签。 */
    if (tab.tagName !== "A") {
      document.querySelector("#guide-tabs").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

switchGuide("combo");
