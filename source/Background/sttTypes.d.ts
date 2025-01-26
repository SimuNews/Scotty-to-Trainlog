import { TrainlogTripType } from "./trainlog/trainlogTypes";


    export interface Location {
        lat: number;
        lng: number;
    }

    export interface Journey {
        legs: Leg[];
        depDateTime: Date;
        arrDateTime: Date;
    }

    export interface Leg {
        stations: TrainStation[];
        operator: string;
        lineName: string;
        price: number;
        currency: string;
        notes: string;
        type: TrainlogTripType;
    }

    export interface TrainStation {
        name: string;
        location: Location;
        platform: string;
        depDateTime?: Date;
        arrDateTime?: Date;
        depDelay?: number;
        arrDelay?: number;
    }