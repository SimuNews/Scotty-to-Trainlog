import { OverpassResponse } from "./overpass";
import * as $ from "jquery";

	const baseUrl = "https://overpass.private.coffee/api/interpreter";

	export async function findNearestMatchingPlatform(location: TLU.Location, platform: string): Promise<TLU.Location> {
        const overpassQuery = `
            [out:json][timeout:25];
            // gather results
            (
                nw["railway"="platform_edge"]["ref"="${platform}"](around:50,${location.lat},${location.lng});
                nw["railway"="platform"]["ref"="${platform}}"](around:50,${location.lat},${location.lng});
            );
            // print results
            (._;>;);
            out;
        `;

        const deferred = $.Deferred<TLU.Location>();
        new ApiUrl(baseUrl).post(
            {"data": overpassQuery}
        )
        .then((json: OverpassResponse) => {
            console.log(json);
			
            const way = json.elements.filter(e => e.type === "way")?.at(0);
            const nodes = json.elements.filter(e => e.type === "node");

			const p1: TLU.Location = {
				lat: nodes.filter(n => n.id === way?.nodes?.at(0)).map(n => n.lat).at(0) as number,
				lng: nodes.filter(n => n.id === way?.nodes?.at(0)).map(n => n.lon).at(0) as number
			}

			const p2: TLU.Location = {
				lat: nodes.filter(n => n.id === way?.nodes?.at(1)).map(n => n.lat).at(0) as number,
				lng: nodes.filter(n => n.id === way?.nodes?.at(1)).map(n => n.lon).at(0) as number
			}

			console.log("Resolve platform: " + platform);
            deferred.resolve({
                lat: midpoint(p1, p2).lat || location.lat,
                lng: midpoint(p1, p2).lng || location.lng
            });
        })
        .fail(() => deferred.resolve({
			lat: location.lat, lng: location.lng
		}));
        return deferred.promise();
	}

	function midpoint(p1: TLU.Location, p2: TLU.Location): TLU.Location {
    	return {
			lat: (p1.lat + p2.lat) / 2,
			lng: (p1.lng + p2.lng) / 2
		};
	}

	export class ApiUrl {
		public readonly url: string;
		public readonly background: boolean;

		constructor(url: string, background: boolean = false) {
			this.url = url;
			this.background = background;
		}

		public get(params: any = {}): JQueryXHR {
			return this.ajax("GET", params);
		}

		public post(data: any = {}): JQueryXHR {
			return this.ajax("POST", data);
		}

		public put(data: any = {}): JQueryXHR {
			return this.ajax("PUT", data);
		}

		private ajax(method: "GET" | "POST" | "PUT", data: any): JQueryXHR {
			const ajaxSettings = {
				url: this.url,
				contentType: "application/x-www-form-urlencoded",
				method: method,
				data: data,
				cache: false
             } as JQueryAjaxSettings;

			return $.ajax(ajaxSettings);
		}
    }