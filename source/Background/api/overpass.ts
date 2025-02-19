namespace OVERPASS {
    export interface OverpassResponse {
        version: number;
        generator: string;
        osm3s: Osm3s;
        elements: OSMElement[];
    }

    export interface OSMElement {
        type: "node" | "way";
        id: number;
        lat?: number;
        lon?: number;
        nodes?: number[];
        tags?: OSMTags;
    }

    export interface OSMTags {
        railway: string;
        ref: string;
    }

    export interface Osm3s {
        timestamp_osm_base: string;
        copyright: string;
    }
}

window.OVERPASS = {
    ...window.OVERPASS,
    ...OVERPASS
}