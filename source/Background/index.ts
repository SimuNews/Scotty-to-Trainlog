import {browser} from 'webextension-polyfill-ts';
import * as scotty from "./oebbScottyResponseTypes";
import * as converter from "./scottyToJourneyConverter";
import * as tl from "./trainlogTypes";
import { api } from './trainlogAPI';
import { Location } from "./sttTypes"

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
            const response: scotty.ScottyResponse = JSON.parse(str);
            if (response?.svcResL[0]?.meth === "TripSearch") {
                localStorage.setItem("lastTripSearch", str);
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

    browser.runtime.onMessage.addListener((message) => {
        if (message.conId) {
            const str = localStorage.getItem("lastTripSearch") as string;
            const jny = new converter.ScottyToJourneyConverter().convert(Number(message.conId), JSON.parse(str) as scotty.ScottyResponse);
            console.log(jny);

            api("saveTrip")
            .post({
                jsonPath: JSON.stringify(jny.legs[0].stations.map(s => s.location) as Location[]),
                newTrip: JSON.stringify({
                    originStation: [locationToArray(jny.legs[0].stations[0].location), jny.legs[0].stations[0].name],
                    destinationStation: [locationToArray(jny.legs[0].stations[jny.legs[0].stations.length - 1].location), jny.legs[0].stations[jny.legs[0].stations.length - 1].name],
                    operator: jny.legs[0].operator,
                    lineName: jny.legs[0].lineName,
                    notes: jny.legs[0].notes,
                    precision: "preciseDates",
                    newTripStartDate: jny.depDateTime.toJSON().substring(0, 10),
                    newTripStartTime: jny.depDateTime.toTimeString().substring(0, 6),
                    newTripStart: jny.depDateTime.toJSON().substring(0, 16),
                    newTripEndDate: jny.arrDateTime.toJSON().substring(0, 10),
                    newTripEndTime: jny.arrDateTime.toTimeString().substring(0, 6),
                    newTripEnd: jny.arrDateTime.toJSON().substring(0, 16),
                    type: tl.TrainlogTripType.TRAIN,
                    price: "",
                    purchasing_date: jny.depDateTime.toJSON().substring(0, 10),
                    currency: "EUR",
                    destinationManualLat: "",
                    destinationManualLng: "",
                    destinationManualName: "",
                    estimated_trip_duration: 0,
                    manDurationHours: "0",
                    manDurationMinutes: "0",
                    material_type: "",
                    onlyDate: "",
                    onlyDateDuration: "",
                    originManualLat: "",
                    originManualLng: "",
                    originManualName: "",
                    reg: "",
                    seat: "",
                    ticket_id: "",
                    trip_length: 0,
                    waypoints: JSON.stringify(jny.legs[0].stations.map(s => s.location) as Location[])
                } as tl.TrainLogNewTrip)
            })
            .done(() => console.log("Uploaded to TL"))
            .fail(() => console.log("Upload failed"));
        }
    });

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

    function locationToArray(loc: Location): number[] {
        return [loc.lat, loc.lng];
    }