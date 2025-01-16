import {browser} from 'webextension-polyfill-ts';
import * as scotty from "./oebbScottyResponseTypes";
import * as converter from "./scottyToJourneyConverter";
import * as tl from "./trainlogTypes";
import { api } from './trainlogAPI';
import { Journey, Location } from "./sttTypes"
import { Overpass } from "./overpassAPI"

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

    browser.runtime.onMessage.addListener(async (message) => {
        if (message.conId) {
            const str = localStorage.getItem("lastTripSearch") as string;
            const jny = new converter.ScottyToJourneyConverter().convert(Number(message.conId), JSON.parse(str) as scotty.ScottyResponse);
            console.log(jny);

            for (let i = 0; i < jny.legs.length; i++) {

                // let realOperators: string[] = [];
                let operator: string = "";
                if (jny.legs[i].operator?.startsWith("WESTBahn")) {
                    operator = "Westbahn";
                } else if (jny.legs[i].operator.startsWith("Nah")) {
                    operator = "ÖBB";
                } else if (jny.legs[i].operator.includes("Postbus")) {
                    operator = "Postbus";
                } else {
                    operator = jny.legs[i].operator;
                }

                const tripToSave = await buildTrip(jny, i, operator);
                // await api(localStorage.getItem("username") + "/getManAndOps/" + tl.TrainlogTripType.TRAIN)
                //     .get()
                //     .done((result: {operators: object}) => {
                //         realOperators.push(...Object.keys(result.operators));
                //     });
                
                // const fuse = new Fuse(realOperators, {
                //     ignoreLocation: true
                // });
                // const realOperatorName = fuse.search(operator);

                console.log(tripToSave);

                api(localStorage.getItem("username") + "/scottySaveTrip")
                .post(tripToSave)
                .done(() => sendMessageToCurrentTab("stt.scotty.upload.success", tl.TrainlogTripType.TRAIN, jny.legs[i].lineName))
                .fail(() => sendMessageToCurrentTab("stt.scotty.upload.failed", tl.TrainlogTripType.TRAIN, jny.legs[i].lineName));
            }
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
    function sendMessageToCurrentTab(msg: string, type?: string, name?: string) {
        var args: any[] = Array.of({msg: msg, type: type, name: name}); //Get arguments as an array
        return browser.tabs.query({active:true,currentWindow:true}).then((tabs) => {
            args.unshift(tabs[0].id); //Add tab ID to be the new first argument.
            return browser.tabs.sendMessage.apply(globalThis, args as any);
        });
    }

    async function getBestPossibleLocation(loc: Location, platform: string) {
        if (!platform) {
            return loc;
        }
        // return loc;
        return Overpass.findNearestMatchingPlatform(loc, platform);
    }

    function locationToArray(loc: Location): number[] {
        return [loc.lat, loc.lng];
    }

    async function buildTrip(jny: Journey, i: number, operator: string) {
        const waypoints: Location[] = [];
        for (let index = 1; index < jny.legs[i].stations.length - 2; index++) {
            const s = jny.legs[i].stations[index];
            waypoints.push(await getBestPossibleLocation(s.location, s.platform))
        }
        
        const originLocation = await getBestPossibleLocation(jny.legs[i].stations[0].location, jny.legs[i].stations[0].platform);
        const destinationLocation = await getBestPossibleLocation(jny.legs[i].stations[jny.legs[i].stations.length - 1].location, jny.legs[i].stations[jny.legs[i].stations.length - 1].platform);

        return {
            jsonPath: JSON.stringify([originLocation, ...waypoints, destinationLocation]),
            newTrip: JSON.stringify({
                originStation: [locationToArray(originLocation), jny.legs[i].stations[0].name],
                destinationStation: [locationToArray(destinationLocation), jny.legs[i].stations[jny.legs[i].stations.length - 1].name],
                operator: operator,
                lineName: jny.legs[i].lineName,
                notes: jny.legs[i].notes,
                precision: "preciseDates",
                newTripStartDate: jny.legs[i].stations[0].depDateTime?.toJSON().substring(0, 10),
                newTripStartTime: jny.legs[i].stations[0].depDateTime?.toTimeString().substring(0, 6),
                newTripStart: jny.legs[i].stations[0].depDateTime?.toJSON().substring(0, 16),
                newTripEndDate: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime?.toJSON().substring(0, 10),
                newTripEndTime: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime?.toTimeString().substring(0, 6),
                newTripEnd: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime?.toJSON().substring(0, 16),
                type: jny.legs[i].type,
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
                waypoints: await JSON.stringify(waypoints)
            } as tl.TrainLogNewTrip)
        }
    }