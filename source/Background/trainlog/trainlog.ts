namespace TLU {

    async function getBestPossibleLocation(loc: TLU.Location, platform?: string) {
        if (!platform || !window.TLU.Options.isUsePlatformSpecificWaypoints()) {
            return Promise.resolve(loc);
        }
        return OVERPASS.findNearestMatchingPlatform(loc, platform);
    }

    function locationToArray(loc: TLU.Location): number[] {
        return [loc.lat, loc.lng];
    }

    export async function buildTrip(jny: TLU.Journey, i: number, operator: string) {
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
                newTripStartDate: window.TLU.formatDateJson(jny.legs[i].stations[0].depDateTime),
                newTripStartTime: window.TLU.formatTime(jny.legs[i].stations[0].depDateTime),
                newTripStart: window.TLU.formatDateTime(jny.legs[i].stations[0].depDateTime),
                newTripEndDate: window.TLU.formatDateJson(jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime),
                newTripEndTime: window.TLU.formatTime(jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime),
                newTripEnd: window.TLU.formatDateTime(jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDateTime),
                type: jny.legs[i].type,
                price: "",
                purchasing_date: window.TLU.formatDateJson(jny.depDateTime),
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
}

window.TLU = {
    ...window.TLU,
    ...TLU
};