namespace STT {

    export class ScottyToJourneyConverter {
        
        private connections: OutConL[];
        private locations: LocL[];
        private lineNames: ProdL[];
        private operators: OpL[];

        public convert(scottyResponse: ScottyResponse): Journey {
            
            const result = scottyResponse.svcResL[0]?.res;
            this.connections = result?.outConL;
            this.locations = result?.common?.locL;
            this.lineNames = result?.common?.prodL;
            this.operators = result?.common?.opL;
            
            return null;
        }

        private locationsToStops(jny: Jny, stops: StopL[]): TrainStation[] {
            const stations: TrainStation[] = [];

            for (const stop of stops) {
                const loc = this.locations[stop.locX];
                stations.push({
                    name: loc.name,
                    location: this.crdToLocation(loc.crd),
                    arrDateTime: this.formatDate(jny.date, stop.aTimeS),
                    depDateTime: this.formatDate(jny.date, stop.dTimeS)
                });
            }
            

        }

        private crdToLocation(crd: Crd): Location {
            return {
                lat: crd.x / 1000000,
                lng: crd.y / 1000000
            }
        }

        private formatDate(date: string, time?: string): Date {
            return new Date();
        }

    }

}