console.log('helloworld from content script');

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
