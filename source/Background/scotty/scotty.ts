import { sendMessageToCurrentTab } from "../TLU/tabUtils";
import { ScottyResponse } from "./scottyTypes";

export class ScottyBackend {
    public registerWebRequestListener(): void {
        browser.webRequest.onBeforeRequest.addListener(
            this.webRequestListener,
            { urls: ["*://fahrplan.oebb.at/bin/mgate.exe*"], types: ["xmlhttprequest"] },
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
            console.log(str);
            const response: ScottyResponse = JSON.parse(str);
            if (response?.svcResL[0]?.meth === "TripSearch") {
                localStorage.setItem("lastTripSearch", str);
                sendMessageToCurrentTab("stt.scotty.saved");
            }
            filter.write(encoder.encode(str));
            filter.close();
        };
    }
}