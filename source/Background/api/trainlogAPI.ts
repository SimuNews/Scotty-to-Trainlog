namespace TLU {
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

		public async get(params: any = {}): Promise<Response> {
			return this.ajax("GET", params);
		}

		public async post(data: any = {}): Promise<Response> {
			return this.ajax("POST", data);
		}

		public async put(data: any = {}): Promise<Response> {
			return this.ajax("PUT", data);
		}

		private async ajax(method: "GET" | "POST" | "PUT", data: any): Promise<Response> {
			const headers = new Headers({
				"Content-Type": "application/x-www-form-urlencoded",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Origin": "https://trainlog.me"
			});

			const options: RequestInit = {
				method: method,
				headers: headers,
				body: method !== "GET" ? new URLSearchParams(data).toString() : undefined,
				credentials: "include"
			};

			const urlWithParams = method === "GET" ? `${this.url}?${new URLSearchParams(data).toString()}` : this.url;

			return fetch(urlWithParams, options);
		}
	}
}

window.TLU = {
    ...window.TLU,
    ...TLU
};
