import * as $ from "jquery";

export namespace TRAINLOG {
    
	const baseUrl = "https://trainlog.me";

	export function api(url: string, background: boolean = false): ApiUrl {
		return new ApiUrl(baseUrl + "/" + url, background);
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
				// dataType: "jsonp",
				crossDomain: true,
				headers: {
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Allow-Origin": "https://trainlog.me"
				},
				data: data,
				cache: false
             } as JQueryAjaxSettings;

			return $.ajax(ajaxSettings);
		}
	}
}
