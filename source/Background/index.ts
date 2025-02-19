import { browser } from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener((): void => {
    console.log('🦄', 'extension installed');
});

SCOTTY.registerWebRequestListener();
DBAHN.registerWebRequestListener();

browser.runtime.onMessage.addListener(async (message: any) => {
    console.log("Message received: ", message);
    if (message.conId) {

        if (!localStorage.getItem("username")) {
            TLU.sendMessageToAllTabs("stt.scotty.no-username");
            return;
        }

        const str = localStorage.getItem("lastTripSearch") as string;
        const jny = new SCOTTY.ScottyToJourneyConverter().convert(Number(message.conId), JSON.parse(str) as SCOTTY.ScottyResponse);
        await uploadJourney(jny, "stt.scotty.upload.end", "stt.scotty.upload.error");
    } else if (message.dbConId) {
        if (!localStorage.getItem("username")) {
            TLU.sendMessageToAllTabs("tlu.dbahn.no-username");
            return;
        }

        const str = localStorage.getItem("tlu.dbahn.lastTripSearch") as string;
        const jny = new DBAHN.DbToJourneyConverter().convert(Number(message.dbConId), JSON.parse(str) as DBAHN.DBahnResponse);
        await uploadJourney(jny, "tlu.dbahn.upload.end", "tlu.dbahn.upload.error");
    }

    async function uploadJourney(convertedJourney: TLU.Journey, allSuccessMessage: string, anyErrorMessage: string) {
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
                TLU.api(localStorage.getItem("username") + "/scottySaveTrip")
                .post(tripToSave)
            );
        }

        anyErrorMessage = anyErrorMessage;
        Promise.allSettled(promises).then((results) => {
            console.log(results);
            TLU.sendMessageToAllTabs(
                allSuccessMessage,
                convertedJourney.legs[0].stations[0].name,
                convertedJourney.legs[convertedJourney.legs.length - 1].stations[convertedJourney.legs[convertedJourney.legs.length - 1].stations.length - 1].name
            );
        });
    }


});