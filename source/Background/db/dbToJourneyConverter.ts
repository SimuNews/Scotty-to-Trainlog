namespace DBAHN {
    export class DbToJourneyConverter {
        // REGEX FOR STATION NAME, LOCATION "/[O|X|Y]=[\d|A-Z|a-z| ]+/gm"
        public convert(conId: number, response: DBahnResponse): TLU.Journey {
            
            const connection = response.verbindungen[conId];
            const legs: TLU.Leg[] = [];
            for (const abschnitt of connection.verbindungsAbschnitte) {
                if (abschnitt.verkehrsmittel.typ !== "PUBLICTRANSPORT") {
                    continue;
                }
                legs.push(this.convertToLeg(abschnitt));
            }
            return {
                legs: legs,
                depDateTime: this.findDepDateTimeForConnection(connection),
                arrDateTime: this.findArrDateTimeForConnection(connection)
            } as TLU.Journey;
        }

        private convertToLeg(abschnitt: VerbindungsAbschnitt): TLU.Leg {
            const { verkehrsmittel, halte } = abschnitt;
            const { zugattribute, mittelText, kategorie, produktGattung } = verkehrsmittel;
            const operator = zugattribute.find(attr => attr.kategorie === "BETREIBER")?.value ?? "";
            const type = produktGattung === "BUS" || kategorie === "Bsv" ? TLU.TrainlogTripType.BUS :
                         produktGattung === "TRAM" ? TLU.TrainlogTripType.TRAM :
                         produktGattung === "UBAHN" ? TLU.TrainlogTripType.METRO :
                         produktGattung === "SCHIFF" ? TLU.TrainlogTripType.FERRY :
                         TLU.TrainlogTripType.TRAIN;

            return {
                stations: halte.map(station => this.convertToTrainStation(station)),
                operator,
                lineName: mittelText,
                price: 0,
                currency: "",
                notes: "",
                type
            } as TLU.Leg;
        }

        private convertToTrainStation(station: Halt): TLU.TrainStation {
            const realTimeArrival = station.ezAnkunftsZeitpunkt;
            const realTimeDeparture = station.ezAbfahrtsZeitpunkt;
            const arrDateString = station.ankunftsZeitpunkt;
            const depDateString = station.abfahrtsZeitpunkt;
            return {
                name: station.name,
                location: this.convertIdToLocation(station.id),
                platform: station.gleis,
                depDateTime: depDateString ? new Date(TLU.Options.isPreventRealtime() ? depDateString : realTimeDeparture || depDateString + "Z") : undefined,
                arrDateTime: arrDateString ? new Date(TLU.Options.isPreventRealtime() ? arrDateString : realTimeArrival || arrDateString + "Z") : undefined,
                // delay in seconds, calculated from the difference between real and scheduled times. If real times are not available, delay is set to 0.
                depDelay: TLU.Options.isUseDelayFields() && realTimeDeparture && depDateString ? Math.round((new Date(realTimeDeparture + "Z").getTime() - new Date(depDateString + "Z").getTime()) / 1000) : 0,
                arrDelay: TLU.Options.isUseDelayFields() && realTimeArrival && arrDateString ? Math.round((new Date(realTimeArrival + "Z").getTime() - new Date(arrDateString + "Z").getTime()) / 1000) : 0,
            } as TLU.TrainStation;
        }

        private findDepDateTimeForConnection(connection: Verbindung): Date {
            const realTimeDeparture = TLU.Options.isPreventRealtime() ? null : connection?.verbindungsAbschnitte[0]?.ezAbfahrtsZeitpunkt;
            return new Date((realTimeDeparture || connection?.verbindungsAbschnitte[0]?.abfahrtsZeitpunkt) + "Z");
        }

        private findArrDateTimeForConnection(connection: Verbindung): Date {
            const lastIndex = connection.verbindungsAbschnitte.length - 1;
            const realTimeArrival = TLU.Options.isPreventRealtime() ? null : connection?.verbindungsAbschnitte[lastIndex]?.ezAnkunftsZeitpunkt;
            return new Date((realTimeArrival || connection?.verbindungsAbschnitte[lastIndex]?.ankunftsZeitpunkt) + "Z");
        }

        private convertIdToLocation(id: string): TLU.Location {
            const match = id.match(/(X|Y)=\d+/gm);
            if (!match) {
                throw new Error("Invalid location id format");
            }
            console.log(id, match);
            
            return {
                lat: Number(match.at(1)?.substring(2)) / 1000000,
                lng: Number(match.at(0)?.substring(2)) / 1000000
            };
        }
    }
}

window.DBAHN = {
    ...window.DBAHN,
    ...DBAHN
}
