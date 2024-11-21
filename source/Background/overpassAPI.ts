import * as $ from "jquery";
import { Location } from "./sttTypes";
import * as o from "./overpass"

export namespace Overpass {

	const baseUrl = "https://overpass.private.coffee/api/interpreter";

	export async function findNearestMatchingPlatform(location: Location, platform: string): Promise<Location> {
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

        const deferred = $.Deferred();
        new ApiUrl(baseUrl).post(
            {"data": overpassQuery}
        )
        .then((json: o.Overpass.OverpassResponse) => {
            
            const way = json.elements.filter(e => e.type === "way")?.at(0);
            const nodes = json.elements.filter(e => e.type === "node");

            deferred.resolve({
                lat: nodes.filter(n => n.id === way?.nodes?.at(0)).map(n => n.lat) ?? location.lat,
                lng: nodes.filter(n => n.id === way?.nodes?.at(0)).map(n => n.lon) ?? location.lng
            });
        })
        .fail(() => deferred.resolve(null));
        return deferred;
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
}