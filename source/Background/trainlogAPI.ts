import "jquery";

// @ts-ignore
namespace STT {
    
	const baseUrl = "https://trainlog.me";
    const currentUser = "SimuOlds"

	export function api(url: string, background: boolean = false): ApiUrl {
		return new ApiUrl(baseUrl + "/" + currentUser + "/" + url, background);
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
				method: method,
				data: data,
				cache: false
             } as JQueryAjaxSettings;

			return $.ajax(ajaxSettings);
		}
	}
}
