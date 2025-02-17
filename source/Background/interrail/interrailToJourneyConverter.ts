namespace INTERRAIL {
    export class InterrailToJourneyConverter {
        public convert(conId: number, response: InterrailResponse[]): TLU.Journey {

            const connection = response[conId];

            const legs: TLU.Leg[] = [];
            for (const leg of connection.legs) {
                if (leg.type !== "TRAIN_TRAVEL") {
                    continue;
                }
                legs.push(this.convertInterrailLegToJourneyLeg(leg));
            }

            return {
                legs: legs,
                depDateTime: this.getUTCDate(connection.departure),
                arrDateTime: this.getUTCDate(connection.arrival)
            } as TLU.Journey;
        }
        
        private convertInterrailLegToJourneyLeg(leg: Leg): TLU.Leg {
            const stations: TLU.TrainStation[] = [];
            stations.push(this.convertStationToTrainStation(leg.start));
            leg.stops?.stops.forEach(stop => {
                stations.push(this.convertStopToTrainStation(stop));
            });
            stations.push(this.convertStationToTrainStation(leg.end));

            return {
                stations: stations,
                operator: leg.transport?.operatorName ?? "",
                lineName: leg.transport?.code ?? "",
                price: 0,
                currency: "EUR",
                notes: "",
                type: TLU.TrainlogTripType.TRAIN
            } as TLU.Leg;
        }

        private convertStopToTrainStation(stop: Stop): TLU.TrainStation {
            return {
                name: stop.station,
                location: {
                    lat: stop.geocoordinates.lat,
                    lng: stop.geocoordinates.lon
                },
            } as TLU.TrainStation;
        }

        private convertStationToTrainStation(station: Station): TLU.TrainStation {
            return {
                name: station.station,
                depDateTime: this.getUTCDate(station.dateTimeInISO),
                arrDateTime: this.getUTCDate(station.dateTimeInISO),
                location: {
                    lat: station.geocoordinates.lat,
                    lng: station.geocoordinates.lon
                },
                platform: station.track,
            } as TLU.TrainStation;
        }

        private getUTCDate(dateString: string): Date {
            // example: 2025-02-27T07:06:00
            return new Date(dateString + "Z");
        }
    }
}

window.INTERRAIL = {
    ...window.INTERRAIL,
    ...INTERRAIL
}
