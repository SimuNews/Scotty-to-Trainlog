namespace INTERRAIL {

    export interface InterrailResponse {
        journeyReservationStatus: string;
        departure: string;
        arrival: string;
        legs: Leg[];
        duration: Time;
        journeyZone: string;
        id: string;
        ctxRecon: string;
        lastUpdatedTimetableInformation: string;
        journeyTrainStatus: string;
        scrB: string;
        scrF: string;
        realtimeInformation?: RealtimeInformation3;
    }

    export interface RealtimeInformation3 {
        messages: any[];
    }

    export interface Leg {
        start: Station;
        end: Station;
        transport?: Transport;
        stops?: Stops;
        facilities?: string[];
        id: string;
        type: "TRAIN_TRAVEL" | "PLATFORM_CHANGE";
        legReservationStatus?: string;
        supplementRequired?: boolean;
        duration: Time;
        trainType?: string;
        allAttributes?: string[];
        legTrainStatus: string;
        prices?: (Price | Price)[];
        bookingInformation?: BookingInformation;
        reservationAttributes?: string[];
    }

    export interface BookingInformation {
        advanceBookingDuration: string;
        scheduleServiceDays: string;
        carrierUrl: string;
        websiteBookingAvailable: boolean;
        linkToBook1?: string;
        bookViaPhone?: string;
        warningLabels?: WarningLabel[];
        transparency?: Transparency;
    }

    export interface Transparency {
        checkSeatAvailability: boolean;
        transparencyMessages: TransparencyMessage[];
    }

    export interface TransparencyMessage {
        link: string;
        message: string;
        type: string;
    }

    export interface WarningLabel {
        type: string;
        label: string;
        detailedTag: string;
        title: string;
        description: string;
        link: string;
    }

    export interface Price {
        type: string;
        amount: number;
    }

    export interface Stops {
        stops: Stop[];
        finalDestination: FinalDestination;
    }

    export interface FinalDestination {
        station: string;
        country: string;
    }

    export interface Stop {
        station: string;
        time?: Time;
        arrTime?: Time;
        depTime?: Time;
        country: string;
        stationId: string;
        geocoordinates: Geocoordinates;
        realtimeInformation: RealtimeInformation2;
    }

    export interface RealtimeInformation2 {
        trainStatus: string;
        messages?: Message[];
    }

    export interface Message {
        key: string;
        value: string;
        message: string;
        type: string;
    }

    export interface Transport {
        type: string;
        code: string;
        operatorCode: string;
        operatorName: string;
        direction: string;
        trainNumber: string;
        trainType: string;
        serviceName?: string;
    }

    export interface Station {
        station: string;
        time: Time;
        country: string;
        id: string;
        dateTimeInISO: string;
        track?: string;
        geocoordinates: Geocoordinates;
        realtimeInformation: RealtimeInformation;
    }

    export interface RealtimeInformation {
        trainStatus: string;
        messages?: any[];
    }

    export interface Geocoordinates {
        lon: number;
        lat: number;
    }

    export interface Time {
        hours: number;
        minutes: number;
    }

}

window.INTERRAIL = {
    ...window.INTERRAIL,
    ...INTERRAIL
}