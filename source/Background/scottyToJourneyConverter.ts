import * as scotty from "./oebbScottyResponseTypes";
import * as stt from "./sttTypes";

    export class ScottyToJourneyConverter {
        
        private connections: scotty.OutConL[];
        private locations: scotty.LocL[];
        private lineNames: scotty.ProdL[];
        private operators: scotty.OpL[];

        /**
         *
         */
        public constructor() {
        }

        public convert(conId: number, scottyResponse: scotty.ScottyResponse): stt.Journey {
            
            const result = scottyResponse.svcResL[0]?.res;
            this.connections = result?.outConL;
            this.locations = result?.common?.locL;
            this.lineNames = result?.common?.prodL;
            this.operators = result?.common?.opL;


            
            const con = this.connections[conId];
            return {
                legs: this.connectionToLegs(con),
                depDateTime: this.formatDate(con.date, con.dep.dTimeR ?? con.dep.dTimeS, con.dep.dTZOffset),
                arrDateTime: this.formatDate(con.date, con.arr.aTimeR ?? con.arr.aTimeS, con.arr.aTZOffset)
            } as stt.Journey;
        }

        private connectionToLegs(connection: scotty.OutConL): stt.Leg[] {
            const legs: stt.Leg[] = [];
            
            connection.secL.forEach(sec => {
                if (sec.type === "JNY") {
                    const lineNameIdx = sec.jny.prodX;
                    const operatorIdx = this.lineNames[lineNameIdx].oprX;
                    legs.push({
                        stations: this.locationsToStations(sec.jny),
                        operator: operatorIdx !== undefined ? this.operators[operatorIdx].name : "",
                        lineName: this.lineNames[lineNameIdx].name,
                        price: 0,
                        currency: "",
                        notes: "Added via STT"
                    });
                }
            })

            return legs;
        }

        private locationsToStations(jny: scotty.Jny): stt.TrainStation[] {
            const stations: stt.TrainStation[] = [];

            for (const stop of jny.stopL) {
                const loc = this.locations[stop.locX];
                stations.push({
                    name: loc.name,
                    location: this.crdToLocation(loc.crd),
                    arrDateTime: this.formatDate(jny.date, stop.aTimeR ?? stop.aTimeS, stop.aTZOffset),
                    depDateTime: this.formatDate(jny.date, stop.dTimeR ?? stop.dTimeS, stop.aTZOffset)
                });
            }

            return stations;
        }

        private crdToLocation(crd: scotty.Crd): stt.Location {
            return {
                lat: crd.y / 1000000,
                lng: crd.x / 1000000
            }
        }

        private formatDate(date: string, time?: string, offset?: number): Date | undefined {
            if (!time) {
                return undefined;
            }

            const plusDays = Math.floor((Number(time) ?? 0) / 1000000);
            const onlyTime = String((Number(time) ?? 0) - (1000000 * plusDays)).padStart(6, "0");

            const dateStr = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6);
            const timeStr = onlyTime.substring(0, 2) + ":" + onlyTime.substring(2, 4) + ":" + onlyTime.substring(4);

            return this.addDays(new Date(Date.parse(dateStr + "T" + timeStr)), plusDays, offset ?? 0);
        }

        addDays(date: Date, days: number, offset: number): Date {
            var date = new Date(date.valueOf());
            date.setDate(date.getDate() + days);
            date.setTime(date.getTime() - date.getTimezoneOffset()*offset*1000)
            return date;
        }

    }