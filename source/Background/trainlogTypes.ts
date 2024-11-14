import { Location } from "./sttTypes"


    export enum TrainlogTripType {
        TRAIN = "train",
        BUS = "bus",
        AIRPLANE = "airplane",
        FERRY = "ferry",
        BICYCLE = "bicycle",
        WALK = "walk",
    }

    export interface TrainlogSaveTripRequest {
        jsonPath: Location[];
        newTrip: TrainLogNewTrip;
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