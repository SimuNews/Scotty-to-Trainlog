namespace TLU {
    export enum TrainlogTripType {
        TRAIN = "train",
        METRO = "metro",
        TRAM = "tram",
        BUS = "bus",
        AIRPLANE = "airplane",
        FERRY = "ferry",
        BICYCLE = "bicycle",
        WALK = "walk",
    }

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

    export interface TrainLogNewTrip {
        originStation: [number[], string];
        originManualName: string;
        originManualLat: string;
        originManualLng: string;
        destinationStation: [number[], string];
        destinationManualName: string;
        destinationManualLat: string;
        destinationManualLng: string;
        operator: string;
        lineName: string;
        material_type: string;
        reg: string;
        seat: string;
        notes: string;
        price: string;
        currency: string;
        purchasing_date: string;
        ticket_id: string;
        precision: string;
        onlyDate: string;
        manDurationHours: string;
        manDurationMinutes: string;
        newTripStartDate: string;
        newTripStartTime: string;
        newTripEndDate: string;
        newTripEndTime: string;
        onlyDateDuration: string;
        newTripEnd: string;
        newTripStart: string;
        type: TrainlogTripType;
        trip_length: number;
        estimated_trip_duration: number;
        waypoints: string;
    }

    export interface TrainlogSaveTripRequest {
        jsonPath: Location[];
        newTrip: TrainLogNewTrip;
    }
}

window.TLU = {
    ...window.TLU,
    ...TLU
};