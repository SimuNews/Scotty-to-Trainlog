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

    function addSeconds(date?: Date, seconds?: number): Date | undefined {
        if (!date) {
            return undefined;
        }
        return new Date(date.getTime() + (seconds ?? 0) * 1000);
    }

    async function stationToWaypoint(s: TLU.TrainStation): Promise<TLU.Waypoint> {
        const loc = await getBestPossibleLocation(s.location, s.platform);
        return {
            lat: loc.lat,
            lng: loc.lng,
            name: s.name,
            stop: {
                name: s.name,
                platform: s.platform ?? "",
                // arr/dep are scheduled times when delay fields are used (delay in seconds), otherwise already realtime with delay 0
                arr: s.arrDateTime,
                dep: s.depDateTime,
                arr_rt: addSeconds(s.arrDateTime, s.arrDelay),
                dep_rt: addSeconds(s.depDateTime, s.depDelay),
                lat: s.location.lat,
                lng: s.location.lng
            }
        };
    }

    export async function buildTrip(jny: TLU.Journey, i: number, operator: string) {
        const stations = jny.legs[i].stations;
        // Intermediate stops only, origin and destination are sent separately
        const waypoints: TLU.Waypoint[] = await Promise.all(stations.slice(1, -1).map(stationToWaypoint));

        const originLocation = await getBestPossibleLocation(jny.legs[i].stations[0]?.location, jny.legs[i].stations[0]?.platform);
        const destinationLocation = await getBestPossibleLocation(jny.legs[i].stations[jny.legs[i].stations.length - 1]?.location, jny.legs[i].stations[jny.legs[i].stations.length - 1]?.platform);
        
        return {
            jsonPath: JSON.stringify([originLocation, ...waypoints.map(w => ({ lat: w.lat, lng: w.lng })), destinationLocation]),
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
                departure_delay: jny.legs[i].stations[0].depDelay ?? 0,
                arrival_delay: jny.legs[i].stations[jny.legs[i].stations.length - 1].arrDelay ?? 0,
                departurePlatform: jny.legs[i].stations[0].platform ?? "",
                arrivalPlatform: jny.legs[i].stations[jny.legs[i].stations.length - 1].platform ?? "",
                viaStations: waypoints.map(w => [locationToArray(w), w.name, w.stop] as TLU.ViaStation),
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
                detailsToggle: "on",
                visibility: "public",
                material_type: "",
                onlyDate: "",
                onlyDateDuration: "",
                originManualLat: "",
                originManualLng: "",
                originManualName: "",
                reg: "",
                seat: "",
                ticket_id: "",
                powerType: "auto",
                trip_length: 0,
                details: null,
                waypoints: await JSON.stringify(waypoints)
            } as TLU.TrainLogNewTrip)
        }
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
};