namespace STT {

    export interface Location {
        lat: number;
        lng: number;
    }

    export interface Journey {
        legs: Leg[];
        price: number;
        currency: string;
    }

    export interface Leg {
        stations: TrainStation[];
        operator: string;
        lineName: string;
    }

    export interface TrainStation {
        name: string;
        location: Location;
        depDateTime: Date;
        arrDateTime: Date;
        depDelay?: number;
        arrDelay?: number;
    }

}