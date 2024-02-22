const handleLoad = async () => {
  const pages = await chrome.storage.local.get([window.location.href]);
  let pageReadPercentage = pages[window.location.href];
  let setPage = false;
  if (pageReadPercentage === undefined) {
    const { patterns } = await chrome.storage.local.get(["patterns"]);
    if (patterns === undefined) {
      chrome.storage.local.set({ pattern: [] });
      return;
    }
    for (const pattern of patterns) {
      if (window.location.href.startsWith(pattern)) {
        chrome.storage.local.set({ [window.location.href]: 0 });
        setPage = true;
        pageReadPercentage = 0;
        break;
      }
    }
  }
  document.getElementsByTagName("a");
  if (pageReadPercentage !== undefined || setPage) {
    const el = document.createElement("button");
    const child = document.createElement("span");
    el.style.cssText = `
  position: fixed;
  transition-duration: 0.3s;
  transition-property: scale;
  bottom: 0;
  right: 0;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #87ceebdd;
  z-index: 9999;
  border-radius: 999px;
  color:black;
  font-weight: bold;
  background-image: linear-gradient(white 50%, skyblue 50%);
  background-size: 100% 200%;
  &:hover:{
    opacity: 0.5;
  }
`;

    child.style.cssText = `
display: inline-block;
font-weight: bold;
font-size:16px;
background-image: linear-gradient(skyblue 50%, white 50%);
background-clip: text;
color: transparent;
background-size: 100% 400%;
`;
    el.appendChild(child);
    el.onclick = () => {
      window.scrollTo(
        0,
        ((window.document.body.scrollHeight - window.innerHeight) *
          latestScrollPercent) /
          100
      );
    };
    let latestScrollPercent = pageReadPercentage;
    child.textContent = `${latestScrollPercent}%`;
    el.style.backgroundPositionY = `${latestScrollPercent}%`;
    child.style.backgroundPositionY = `${latestScrollPercent}%`;
    document.body.appendChild(el);

    if (latestScrollPercent === 100) {
      child.style.color = "black";
      child.textContent = "🎉";
      return;
    }
    const handleScroll = () => {
      const scrollAmount = window.scrollY;
      const maxScroll = window.document.body.scrollHeight - window.innerHeight;
      const percentage = Math.round((scrollAmount / maxScroll) * 100);
      if (percentage > latestScrollPercent) {
        child.textContent = `${percentage}%`;
        el.style.backgroundPositionY = `${percentage}%`;
        child.style.backgroundPositionY = `${percentage}%`;
        chrome.storage.local.set({ [window.location.href]: percentage });
        latestScrollPercent = percentage;
      }
      if (percentage === 100) {
        child.style.color = "black";
        child.textContent = "🎉";
        el.style.scale = "1.5";
        window.removeEventListener("scroll", handleScroll);
        setTimeout(() => {
          el.style.scale = "1";
        }, 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }
};
let oldUrl = "";

const observer = new MutationObserver(() => {
  if (oldUrl !== location.href) {
    window.dispatchEvent(new CustomEvent("urlChange"));
    oldUrl = location.href;
    handleLoad();
  }
});

observer.observe(document.body, {
  subtree: true,
  childList: true,
  attributes: true,
  characterData: true,
});
