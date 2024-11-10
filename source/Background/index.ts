import {browser} from 'webextension-polyfill-ts';
import { ScottyResponse } from './oebbScottyResponseTypes';

// @ts-ignore
namespace STT {

    browser.runtime.onInstalled.addListener((): void => {
        console.log('🦄', 'extension installed');
    });

    function listener(details: any) {
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
                browser?.storage?.local?.set({
                    "lastTripSearch": str
                });
                sendMessageToCurrentTab("stt.scotty.saved");
            }
            filter.write(encoder.encode(str));
            filter.close();
        };
    }

    browser.webRequest.onBeforeRequest.addListener(
        listener,
        { urls: ["*://fahrplan.oebb.at/bin/mgate.exe*"], types: ["xmlhttprequest"] },
        ["blocking"],
    );

    /*                  Promises based version (browser.*)
    * Send a message to the current tab. Arguments are the same as browser.tabs.sendMessage(),
    *   except no tabId is provided.
    *
    * sendMessageToCurrentTab(
    *     message (any) message to send
    *     options (optional object) same as tabs.sendMessage():'frameId' prop is the frame ID.
    * )
    */
    function sendMessageToCurrentTab(msg: string) {
        var args: any[] = Array.of(msg); //Get arguments as an array
        return browser.tabs.query({active:true,currentWindow:true}).then((tabs) => {
            args.unshift(tabs[0].id); //Add tab ID to be the new first argument.
            return browser.tabs.sendMessage.apply(globalThis, args as any);
        });
    }
}