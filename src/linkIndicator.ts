export const linkIndicatorInit = async () => {
  if(window.location.href.includes("github.com") === false) {
		return;
  }

  const githubItemLinks = document.getElementsByClassName(
    "PRIVATE_TreeView-item"
  );
  const baseUrl = window.location.href.split("/").slice(0, 7).join("/");
  for (const link of githubItemLinks) {
    const target = `${baseUrl}/${link.getAttribute("id")?.replace("-item", "")}`;
    const res = await chrome.storage.local.get([target]);
    const indicator = res[`${target}`]===100?"🎉":res[`${target}`];
    if (indicator === undefined) {
      continue;
    }
    if(link.getElementsByClassName("indicator").length === 0) {
      const el = document.createElement("div");
      el.innerText = indicator;
      el.className = "indicator";
      el.style.cssText = `
      border-radius: 999px;
      font-weight: bold;
      font-size:10px;
      width: 20px;
      height: 20px;
      text-align: center;
      background-image: linear-gradient( white 50%,skyblue 50%);
      color: gray;
      background-size: 100% 200%;
      background-position-y: ${indicator==="🎉"?100:indicator}%;
      padding: 2.5px 0px;
      `;
      link
      .getElementsByClassName("PRIVATE_TreeView-item-content")[0]
      .appendChild(el);
    }
   const indicateElm = link.getElementsByClassName("indicator")[0];
   indicateElm.textContent = indicator
   indicateElm.setAttribute("style",`${indicateElm.getAttribute("style")}; background-position-y: ${indicator}%;`);

  }
};
