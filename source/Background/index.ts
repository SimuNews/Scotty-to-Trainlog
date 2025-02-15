import { browser } from 'webextension-polyfill-ts';
import Fuse, { FuseResult } from 'fuse.js';
import { api } from './api/trainlogAPI';
import { findNearestMatchingPlatform } from './api/overpassAPI';

    browser.runtime.onInstalled.addListener((): void => {
        console.log('🦄', 'extension installed');
    });

    SCOTTY.registerWebRequestListener();
    DBAHN.registerWebRequestListener();

    browser.runtime.onMessage.addListener(async (message: any) => {
        console.log("Message received: ", message);
        if (message.conId) {

            if (!localStorage.getItem("username")) {
                TLU.sendMessageToCurrentTab("stt.scotty.no-username");
                return;
            }

            const str = localStorage.getItem("lastTripSearch") as string;
            const jny = new SCOTTY.ScottyToJourneyConverter().convert(Number(message.conId), JSON.parse(str) as SCOTTY.ScottyResponse);
            console.log(jny);

            const promises = [];
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

                let realOperators: string[] = [];
                await api(localStorage.getItem("username") + "/getManAndOps/" + jny.legs[i].type)
                .get()
                .done((result: {operators: object}) => {
                    realOperators.push(...Object.keys(result.operators));
                });
                
                const fuse = new Fuse(realOperators, {
                    ignoreLocation: true,
                    threshold: 0.4,
                    ignoreFieldNorm: true,
                    isCaseSensitive: false
                });
                const realOperatorName: FuseResult<string>[] = fuse.search(operator);
                
                const tripToSave = await buildTrip(jny, i, realOperatorName.at(0)?.item ?? "");
                console.log(tripToSave);

                promises.push(
                    api(localStorage.getItem("username") + "/scottySaveTrip")
                    .post(tripToSave)
                );
            }

            Promise.allSettled(promises).then((results) => {
                console.log(results);
                TLU.sendMessageToCurrentTab(
                    "stt.scotty.upload.end",
                    jny.legs[0].stations[0].name,
                    jny.legs[jny.legs.length - 1].stations[jny.legs[jny.legs.length - 1].stations.length - 1].name
                );
            });
        } else if (message.dbConId) {
            if (!localStorage.getItem("username")) {
                TLU.sendMessageToCurrentTab("stt.scotty.no-username");
                return;
            }

            const str = localStorage.getItem("tlu.dbahn.lastTripSearch") as string;
            const jny = new DBAHN.DbToJourneyConverter().convert(Number(message.dbConId), JSON.parse(str) as DBAHN.DBahnResponse);
            console.log(jny);

            const promises = [];
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

                let realOperators: string[] = [];
                await api(localStorage.getItem("username") + "/getManAndOps/" + jny.legs[i].type)
                .get()
                .done((result: {operators: object}) => {
                    realOperators.push(...Object.keys(result.operators));
                });
                
                const fuse = new Fuse(realOperators, {
                    ignoreLocation: true,
                    threshold: 0.4,
                    ignoreFieldNorm: true,
                    isCaseSensitive: false
                });
                const realOperatorName: FuseResult<string>[] = fuse.search(operator);
                
                const tripToSave = await buildTrip(jny, i, realOperatorName.at(0)?.item ?? "");
                console.log(tripToSave);

                promises.push(
                    api(localStorage.getItem("username") + "/scottySaveTrip")
                    .post(tripToSave)
                );
            }

            Promise.allSettled(promises).then((results) => {
                console.log(results);
                TLU.sendMessageToCurrentTab(
                    "stt.scotty.upload.end",
                    jny.legs[0].stations[0].name,
                    jny.legs[jny.legs.length - 1].stations[jny.legs[jny.legs.length - 1].stations.length - 1].name
                );
            });
        }
    });

    async function getBestPossibleLocation(loc: TLU.Location, platform: string) {
        if (!platform) {
            return loc;
        }
        return findNearestMatchingPlatform(loc, platform);
    }

    function locationToArray(loc: TLU.Location): number[] {
        return [loc.lat, loc.lng];
    }

    async function buildTrip(jny: TLU.Journey, i: number, operator: string) {
        const waypoints: TLU.Location[] = [];
        for (let index = 1; index < jny.legs[i].stations.length - 2; index++) {
            const s = jny.legs[i].stations[index];
            console.log("Station: " + s.name);
            waypoints.push(await getBestPossibleLocation(s.location, s.platform))
        }
        
        const originLocation = await getBestPossibleLocation(jny.legs[i].stations[0]?.location, jny.legs[i].stations[0]?.platform);
        const destinationLocation = await getBestPossibleLocation(jny.legs[i].stations[jny.legs[i].stations.length - 1]?.location, jny.legs[i].stations[jny.legs[i].stations.length - 1]?.platform);

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
                newTripStartTime: jny.legs[i].stations[0].depDateTime?.toTimeString().substring(0, 5),
                newTripStart: jny.legs[i].stations[0].depDateTime?.toISOString().substring(0, 16),
                newTripEndDate: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime?.toJSON().substring(0, 10),
                newTripEndTime: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime?.toTimeString().substring(0, 5),
                newTripEnd: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime?.toISOString().substring(0, 16),  // Error: Server must have local datetime
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
            } as TLU.TrainLogNewTrip)
        }
    }