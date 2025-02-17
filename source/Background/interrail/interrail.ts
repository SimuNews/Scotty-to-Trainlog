namespace INTERRAIL {
    export function registerWebRequestListener() {
        browser.webRequest.onBeforeRequest.addListener(
            webRequestListener,
            { urls: ["*://api.timetable.eurail.com/*/timetable*"], types: ["xmlhttprequest"] },
            ["blocking"],
        );
    }

    function webRequestListener(details: any) {
        const filter = browser.webRequest.filterResponseData(details.requestId);
        const decoder = new TextDecoder("utf-8");
        const encoder = new TextEncoder();

        const data: any[] = [];
        filter.ondata = (event) => {
            data.push(event.data);
        };

        filter.onstop = async () => {
            const blob = new Blob(data, { type: "text/html" });
            const buffer = await blob.arrayBuffer();
            let str = decoder.decode(buffer);
            console.log("Interrail trip search", str);
            localStorage.setItem("tlu.interrail.lastTripSearch", str);
            TLU.sendMessageToAllTabs("tlu.interrail.timeTableLoaded");
            filter.write(encoder.encode(str));
            filter.close();
        };
    }
}

window.INTERRAIL = {
    ...window.INTERRAIL,
    ...INTERRAIL
}