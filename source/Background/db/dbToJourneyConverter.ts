import { DBahnResponse, VerbindungsAbschnitt, Halt, Verbindung } from "./dbTypes";

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
                legs.push(this.convertToLeg(abschnitt));
            }
            return {
                legs: legs,
                depDateTime: this.findDepDateTimeForConnection(connection),
                arrDateTime: this.findArrDateTimeForConnection(connection)
            } as TLU.Journey;
        }

        private convertToLeg(abschnitt: VerbindungsAbschnitt): TLU.Leg {
            return {
                stations: abschnitt.halte.map(this.convertToTrainStation),
                operator: abschnitt.verkehrsmittel.zugattribute.find(attr => attr.kategorie === "BETREIBER")?.value ?? "",
                lineName: abschnitt.verkehrsmittel.name,
                price: 0,
                currency: "",
                notes: "",
                type: TLU.TrainlogTripType.TRAIN
            } as TLU.Leg;
        }

        private convertToTrainStation(station: Halt): TLU.TrainStation {
            return {
                name: station.name,
                location: convertIdToLocation(station.id),
                platform: station.gleis,
                arrDateTime: new Date(station.ezAnkunftsZeitpunkt ?? station.ankunftsZeitpunkt ?? ""),
                depDateTime: new Date(station.ezAbfahrtsZeitpunkt ?? station.abfahrtsZeitpunkt ?? ""),
            } as TLU.TrainStation;
        }

        private findDepDateTimeForConnection(connection: Verbindung): Date {
            return new Date(connection?.verbindungsAbschnitte[0]?.ezAbfahrtsZeitpunkt || connection?.verbindungsAbschnitte[0]?.abfahrtsZeitpunkt);
        }

        private findArrDateTimeForConnection(connection: Verbindung): Date {
            const lastIndex = connection.verbindungsAbschnitte.length - 1;
            return new Date(connection?.verbindungsAbschnitte[lastIndex]?.ezAnkunftsZeitpunkt || connection?.verbindungsAbschnitte[lastIndex]?.ankunftsZeitpunkt);
        }

    }


function convertIdToLocation(id: string): TLU.Location {
    const match = id.match(/(X|Y)=\d+/gm);
    if (!match) {
        throw new Error("Invalid location id format");
    }
    return {
        lat: Number(match.at(0)?.substring(2)) / 1000000,
        lng: Number(match.at(1)?.substring(2)) / 1000000
    };
}
