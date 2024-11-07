// import { browser } from "webextension-polyfill-ts";

console.log('helloworld from content script');

// function saveData(result: any) {
//     console.log(result);
// }

// browser.webRequest.onCompleted.addListener(
//     saveData,
//     {
//         urls: ["http://*/*","https://*/*"],
//         types: ['xmlhttprequest']
//     });

window.addEventListener("resize", (ev: any) => {
    console.log("resize");
    const doc: Document = ev.originalTarget?.document;
    const elements = doc.querySelectorAll(".lyr_tpActionButtons");
    elements.forEach(e => e.appendChild(
        doc.createElement("button")
            .appendChild(
                doc.createElement("span")
            )
        )
    );
});

export {};
