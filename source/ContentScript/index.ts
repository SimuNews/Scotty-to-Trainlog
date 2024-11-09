import { browser } from "webextension-polyfill-ts";

browser.runtime.onMessage.addListener(() => {
    addEventListenersToBtns();
});

const doc = window.document;
const listenerClass = ".lyr_atomBtn";
addEventListenersToBtns();

function addEventListenersToBtns() {
    let clickableAtomBtns = doc.querySelectorAll(listenerClass);
    clickableAtomBtns.forEach((e) => {
        e.addEventListener("click", appendTrainLogBtn);
    });
}

function appendTrainLogBtn() {
    const containers = doc.querySelectorAll(".lyr_tpActionButtons:not(:has(.stt-trainlog))");
    console.log(containers);
    containers.forEach(e => e.appendChild(createTrainLogBtn()));
    addEventListenersToBtns();
}

/*
<button class="lyr_atomBtn lyr_atomActionBtn stt-trainlog" type="button">
  <span class="lyr_atomIcon  ">
    <i class="haf_ic_quickaction_ticket" aria-hidden="true"></i>
    <span class="lyr_atomIconText"></span>
  </span>
  <span class=" lyr_atomText">To Trainlog</span>
</button>
*/
function createTrainLogBtn(): HTMLElement {
    const btn = doc.createElement("button");
    btn.classList.add("lyr_atomBtn");
    btn.classList.add("lyr_atomActionBtn");
    btn.classList.add("stt-trainlog");
    btn.type = "button";

    const iconSpan = doc.createElement("span");
    iconSpan.classList.add("lyr_atomIcon");

    const icon = doc.createElement("img");
    icon.src = browser.runtime.getURL("assets/icons/logo_trainlog.png");
    icon.width = 20;
    icon.height = 20;
    icon.ariaHidden = "true";

    const iconTextSpan = doc.createElement("span");
    iconTextSpan.classList.add("lyr_atomIconText");

    iconSpan.appendChild(icon);
    iconSpan.appendChild(iconTextSpan);

    const textSpan = doc.createElement("span");
    textSpan.classList.add("lyr_atomText");
    textSpan.innerText = "To Trainlog";

    btn.appendChild(iconSpan);
    btn.appendChild(textSpan);

    btn.addEventListener("click", (e: Event) => onTrainlogBtnClick(e.target as HTMLElement));

    return btn;
}

function onTrainlogBtnClick(btn: HTMLElement) {
    const tripContainer = btn.closest(".lyr_tpConDetailWrapper");
    const id = tripContainer?.id as string;
    console.log("Connection Id: " + id?.replace("HFS_RES_PT_", ""));
}


export {};
