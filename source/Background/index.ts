import { browser } from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener((): void => {
    console.log('🦄', 'extension installed');
});

SCOTTY.registerWebRequestListener();
DBAHN.registerWebRequestListener();
INTERRAIL.registerWebRequestListener();

browser.runtime.onMessage.addListener(async (message: any) => {
    console.log("Message received: ", message);
    if (message.conId) {

        if (!localStorage.getItem("username")) {
            TLU.sendMessageToAllTabs("stt.scotty.no-username");
            return;
        }

        const str = localStorage.getItem("lastTripSearch") as string;
        const jny = new SCOTTY.ScottyToJourneyConverter().convert(Number(message.conId), JSON.parse(str) as SCOTTY.ScottyResponse);
        await uploadJourney(jny, 0, "stt.scotty.upload.end", "stt.scotty.upload.error");
    } else if (message.dbConId) {
        if (!localStorage.getItem("username")) {
            TLU.sendMessageToAllTabs("tlu.dbahn.no-username");
            return;
        }

        const str = localStorage.getItem("tlu.dbahn.lastTripSearch") as string;
        const jny = new DBAHN.DbToJourneyConverter().convert(Number(message.dbConId), JSON.parse(str) as DBAHN.DBahnResponse);
        await uploadJourney(jny, 0, "tlu.dbahn.upload.end", "tlu.dbahn.upload.error");
    } else if (message.interrailConId) {
        const conId = Number(message.interrailConId);
        if (!localStorage.getItem("username")) {
            TLU.sendMessageToAllTabs("tlu.interrail.no-username", conId);
            return;
        }

        const str = localStorage.getItem("tlu.interrail.lastTripSearch") as string;
        const jny = new INTERRAIL.InterrailToJourneyConverter().convert(conId, JSON.parse(str) as INTERRAIL.InterrailResponse[]);
        await uploadJourney(jny, conId, "tlu.interrail.upload.end", "tlu.interrail.upload.error");
    }

    async function uploadJourney(convertedJourney: TLU.Journey, conId: number, allSuccessMessage: string, anyErrorMessage: string) {
        console.log("Converted Journey: ", convertedJourney);
        const promises = [];
        for (let i = 0; i < convertedJourney.legs.length; i++) {

            // let realOperators: string[] = [];
            let operator: string = "";
            if (convertedJourney.legs[i].operator?.startsWith("WESTBahn")) {
                operator = "Westbahn";
            } else if (convertedJourney.legs[i].operator.startsWith("Nah")) {
                operator = "ÖBB";
            } else if (convertedJourney.legs[i].operator.includes("Postbus")) {
                operator = "Postbus";
            } else {
                operator = convertedJourney.legs[i].operator;
            }
            
            const tripToSave = await TLU.buildTrip(convertedJourney, i, operator);
            console.log(tripToSave);

            promises.push(
                TLU.api("u/" + localStorage.getItem("username") + "/scottySaveTrip")
                .post(tripToSave)
            );
        }

        Promise.allSettled(promises)
        .then((results) => {
            console.log(results);
            let allSuccess = true;
            for (const result of results) {
                if (result.status === "fulfilled") {
                    const reponse: Response = result.value;
                    if (!reponse.ok) {
                        allSuccess = false;
                    }
                }
            }
            if (!allSuccess) {
                TLU.sendMessageToAllTabs(
                    anyErrorMessage,
                    conId
                );
            } else {
                TLU.sendMessageToAllTabs(
                    allSuccessMessage,
                    conId,
                    convertedJourney.legs[0].stations[0].name,
                    convertedJourney.legs[convertedJourney.legs.length - 1].stations[convertedJourney.legs[convertedJourney.legs.length - 1].stations.length - 1].name
                );
            }
            
        });
    }


});