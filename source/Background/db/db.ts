export class DBBackend {

    public registerWebRequestListener() {
        browser.webRequest.onBeforeRequest.addListener(
            this.webRequestListener,
            { urls: ["*://*.bahn.de/*/fahrplan*"], types: ["xmlhttprequest"] },
            ["blocking"],
        );
    }


    private webRequestListener(details: any) {
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
            console.log("Deutche Bahn trip search", str);
            localStorage.setItem("tlu.dbahn.lastTripSearch", str);
            TLU.sendMessageToCurrentTab("tlu.dbahn.timeTableLoaded");
            filter.write(encoder.encode(str));
            filter.close();
        };
    }
}