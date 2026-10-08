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

    export interface WaypointStop {
        name: string;
        cc?: string;
        platform: string;
        arr?: Date;
        dep?: Date;
        arr_rt?: Date;
        dep_rt?: Date;
        tz?: string;
        lat: number;
        lng: number;
        id?: string;
        trip?: string;
    }

    export interface Waypoint {
        lat: number;
        lng: number;
        name: string;
        stop: WaypointStop;
    }

    // [[lat, lng], name, stop]
    export type ViaStation = [number[], string, WaypointStop];

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
        platform?: string;
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
        detailsToggle: string;
        visibility: string;
        material_type: string;
        reg: string;
        seat: string;
        notes: string;
        price: string;
        currency: string;
        purchasing_date: string;
        ticket_id: string;
        powerType: string;
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
        // In seconds
        departure_delay: number;
        // In seconds
        arrival_delay: number;
        departurePlatform: string;
        arrivalPlatform: string;
        viaStations: ViaStation[];
        type: TrainlogTripType;
        trip_length: number;
        estimated_trip_duration: number;
        details: any;
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