namespace DBAHN {
    export class DbToJourneyConverter {
        // REGEX FOR STATION NAME, LOCATION "/[O|X|Y]=[\d|A-Z|a-z| ]+/gm"
        public convert(conId: number, response: DBahnResponse): TLU.Journey {
            
            const connection = response.verbindungen[conId];
            connection.verbindungsAbschnitte.forEach((abschnitt: VerbindungsAbschnitt) => {
                console.log(abschnitt);
                "".matchAll(/(O|X|Y)=([\d|A-Z|a-z| ]+)/gm);
            });
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
            const arrDateString = station.ankunftsZeitpunkt ?? station.ezAnkunftsZeitpunkt ?? "";
            const depDateString = station.ezAbfahrtsZeitpunkt ?? station.abfahrtsZeitpunkt ?? "";
            return {
                name: station.name,
                location: this.convertIdToLocation(station.id),
                platform: station.gleis,
                arrDateTime: arrDateString ? new Date(arrDateString + "Z") : undefined,
                depDateTime: depDateString ? new Date(depDateString + "Z") : undefined,
            } as TLU.TrainStation;
        }

        private findDepDateTimeForConnection(connection: Verbindung): Date {
            return new Date((connection?.verbindungsAbschnitte[0]?.ezAbfahrtsZeitpunkt || connection?.verbindungsAbschnitte[0]?.abfahrtsZeitpunkt) + "Z");
        }

        private findArrDateTimeForConnection(connection: Verbindung): Date {
            const lastIndex = connection.verbindungsAbschnitte.length - 1;
            return new Date((connection?.verbindungsAbschnitte[lastIndex]?.ezAnkunftsZeitpunkt || connection?.verbindungsAbschnitte[lastIndex]?.ankunftsZeitpunkt) + "Z");
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
