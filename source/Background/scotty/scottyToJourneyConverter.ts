namespace SCOTTY {
    export class ScottyToJourneyConverter {
        
        private connections: OutConL[] = [];
        private locations: LocL[] = [];
        private lineNames: ProdL[] = [];
        private operators: OpL[] = [];

        public convert(conId: number, response: ScottyResponse): TLU.Journey {
            
            const result = response.svcResL[0]?.res;
            this.connections = result?.outConL;
            this.locations = result?.common?.locL;
            this.lineNames = result?.common?.prodL;
            this.operators = result?.common?.opL;
            
            const con = this.connections[conId];
            return {
                legs: this.connectionToLegs(con),
                depDateTime: this.formatDate(con.date, con.dep.dTimeR, con.dep.dTimeS, con.dep.dTZOffset, TLU.Options.isPreventRealtime()),
                arrDateTime: this.formatDate(con.date, con.arr.aTimeR, con.arr.aTimeS, con.arr.aTZOffset, TLU.Options.isPreventRealtime())
            } as TLU.Journey;
        }

        private connectionToLegs(connection: OutConL): TLU.Leg[] {
            const legs: TLU.Leg[] = [];
            
            connection.secL.forEach(sec => {
                if (sec.type === "JNY") {
                    const lineNameIdx = sec.jny.prodX;
                    const operatorIdx = this.lineNames[lineNameIdx].oprX;
                    const operatorName = operatorIdx !== undefined ? this.operators[operatorIdx].name : "";
                    const lineName = this.lineNames[lineNameIdx].nameS || this.lineNames[lineNameIdx].name;
                    legs.push({
                        stations: this.locationsToStations(sec.jny),
                        operator: operatorName,
                        lineName: lineName,
                        price: 0,
                        currency: "",
                        notes: "",
                        type: lineName.startsWith("Bus") || lineName.startsWith("O-Bus") || lineName.startsWith("ICB") ? TLU.TrainlogTripType.BUS : lineName.startsWith("Schiff") ? TLU.TrainlogTripType.FERRY : lineName.startsWith("U") ? TLU.TrainlogTripType.METRO : lineName.startsWith("Tram") ? TLU.TrainlogTripType.TRAM : TLU.TrainlogTripType.TRAIN
                    });
                }
            })

            return legs;
        }

        private locationsToStations(jny: Jny): TLU.TrainStation[] {
            const stations: TLU.TrainStation[] = [];

            for (const stop of jny.stopL) {
                const loc = this.locations[stop.locX];
                const scheduledDepDateTime = this.formatDate(jny.date, stop.dTimeR, stop.dTimeS, stop.dTZOffset, true);
                const scheduledArrDateTime = this.formatDate(jny.date, stop.aTimeR, stop.aTimeS, stop.aTZOffset, true);
                const realDepDateTime = this.formatDate(jny.date, stop.dTimeR, stop.dTimeS, stop.dTZOffset, false);
                const realArrDateTime = this.formatDate(jny.date, stop.aTimeR, stop.aTimeS, stop.aTZOffset, false);
                stations.push({
                    name: loc.name,
                    location: this.crdToLocation(loc.crd),
                    platform: this.stopToPlatform(stop),
                    depDateTime: TLU.Options.isPreventRealtime() ? scheduledDepDateTime : realDepDateTime ?? scheduledDepDateTime,
                    arrDateTime: TLU.Options.isPreventRealtime() ? scheduledArrDateTime : realArrDateTime ?? scheduledArrDateTime,
                    // Delay in seconds, calculated from the difference between real and scheduled times. If real times are not available, delay is set to 0.
                    depDelay: TLU.Options.isUseDelayFields() && realDepDateTime && scheduledDepDateTime ? Math.round((realDepDateTime.getTime() - scheduledDepDateTime.getTime()) / 1000) : 0,
                    arrDelay: TLU.Options.isUseDelayFields() && realArrDateTime && scheduledArrDateTime ? Math.round((realArrDateTime.getTime() - scheduledArrDateTime.getTime()) / 1000) : 0,
                });
            }

            return stations;
        }

        private crdToLocation(crd: Crd): TLU.Location {
            return {
                lat: crd.y / 1000000,
                lng: crd.x / 1000000
            }
        }

        private stopToPlatform(stop: StopL): string {
            const realTimeDeparturePlatform = TLU.Options.isPreventRealtime() ? null : stop.dPltfR?.txt.replace(/[^0-9]/g, "");
            const realTimeArrivalPlatform = TLU.Options.isPreventRealtime() ? null : stop.aPltfR?.txt.replace(/[^0-9]/g, "");
            const departurePlatform = realTimeDeparturePlatform ? realTimeDeparturePlatform : stop.dPltfS?.txt.replace(/[^0-9]/g, "");
            const arrivalPlatform = realTimeArrivalPlatform ? realTimeArrivalPlatform : stop.aPltfS?.txt.replace(/[^0-9]/g, "");
            return departurePlatform ? departurePlatform : arrivalPlatform ? arrivalPlatform : "";
        }

        private formatDate(date: string, realTime?: string, scheduledTime?: string, offset?: number, preventRealtime?: boolean): Date | undefined {
            const time = preventRealtime ? scheduledTime : realTime ?? scheduledTime;
            if (!time) {
                return undefined;
            }

            const plusDays = Math.floor((Number(time) ?? 0) / 1000000);
            const onlyTime = String((Number(time) ?? 0) - (1000000 * plusDays)).padStart(6, "0");

            const dateStr = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6);
            const timeStr = onlyTime.substring(0, 2) + ":" + onlyTime.substring(2, 4) + ":" + onlyTime.substring(4);

            return this.addDays(new Date(Date.parse(dateStr + "T" + timeStr + "Z")), plusDays, offset ?? 0);
        }

        private addDays(date: Date, days: number, offset: number): Date {
            var date = new Date(date.valueOf());
            date.setDate(date.getDate() + days);
            offset = offset * 60 * 1000;
            // date.setTime(date.getTime() - date.getTimezoneOffset()*offset*1000)
            return date;
        }

    }
}

window.SCOTTY = {
    ...window.SCOTTY,
    ...SCOTTY
}