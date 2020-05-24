/// <reference types="node" />
declare module "lib/helpers/parse-link-header" {
    export = parseLinkHeader;
    /**
     * Parse a Link header.
     *
     * @param {string} linkHeader
     * @returns {{
     *   [k: string]: {
     *     url: string,
     *     params: { [p: string]: string }
     *   }
     * }}
     */
    function parseLinkHeader(linkHeader: string): {
        [k: string]: {
            url: string;
            params: {
                [p: string]: string;
            };
        };
    };
}
declare module "lib/helpers/url-utils" {
    /**
     * Derive a query string from an object and append it
     * to a URL.
     *
     * @param {string} url
     * @param {Object} [queryObject] - Values should be primitives.
     * @returns {string} - Modified URL.
     */
    export function appendQueryObject(url: string, queryObject?: any): string;
    /**
     * Append a query parameter to a URL.
     *
     * @param {string} url
     * @param {string} key
     * @param {string|number|boolean|Array<*>} [value] - Provide an array
     *   if the value is a list and commas between values need to be
     *   preserved, unencoded.
     * @returns {string} - Modified URL.
     */
    export function appendQueryParam(url: string, key: string, value?: string | number | boolean | any[]): string;
    /**
     * Prepend an origin to a URL. If the URL already has an
     * origin, do nothing.
     *
     * @param {string} url
     * @param {string} origin
     * @returns {string} - Modified URL.
     */
    export function prependOrigin(url: string, origin: string): string;
    /**
     * Interpolate values into a route with express-style,
     * colon-prefixed route parameters.
     *
     * @param {string} route
     * @param {Object} [params] - Values should be primitives
     *   or arrays of primitives. Provide an array if the value
     *   is a list and commas between values need to be
     *   preserved, unencoded.
     * @returns {string} - Modified URL.
     */
    export function interpolateRouteParams(route: string, params?: any): string;
}
declare module "lib/constants" {
    export const API_ORIGIN: string;
    export const EVENT_PROGRESS_DOWNLOAD: string;
    export const EVENT_PROGRESS_UPLOAD: string;
    export const EVENT_ERROR: string;
    export const EVENT_RESPONSE: string;
    export const ERROR_HTTP: string;
    export const ERROR_REQUEST_ABORTED: string;
}
declare module "lib/classes/mapi-client" {
    export = MapiClient;
    /**
     * A low-level Mapbox API client. Use it to create service clients
     * that share the same configuration.
     *
     * Services and `MapiRequest`s use the underlying `MapiClient` to
     * determine how to create, send, and abort requests in a way
     * that is appropriate to the configuration and environment
     * (Node or the browser).
     *
     * @class MapiClient
     * @interface
     * @property {string} accessToken - The Mapbox access token assigned
     *   to this client.
     * @property {string} [origin] - The origin
     *   to use for API requests. Defaults to https://api.mapbox.com.
     */
    /**
     * @ignore
     * @typedef MapiClientOptions
     * @property {string} accessToken
     * @property {string} [origin]
     */
    class MapiClient {
        /**
         * @ignore
         * @constructor
         * @param {MapiClientOptions} options
         */
        constructor(options: MapiClientOptions);
        accessToken: string;
        origin: string;
        /** @ignore @method @param {MapiRequestOptions} requestOptions */
        createRequest(requestOptions: import("lib/classes/mapi-request").MapiRequestOptions): import("lib/classes/mapi-request");
        /**
         * @ignore
         * @method
         * @param {*} request
         * @returns {Promise<*>}
         */
        sendRequest(request: any): Promise<any>;
        /**
         * @ignore
         * @method
         * @param {*} request
         * @returns {void}
         */
        abortRequest(request: any): void;
    }
    namespace MapiClient {
        export { MapiRequestOptions, MapiClientOptions };
    }
    type MapiClientOptions = {
        accessToken: string;
        origin?: string;
    };
    type MapiRequestOptions = {
        method: string;
        path: string;
        query?: any;
        params?: any;
        origin?: string;
        headers?: any;
        body?: any;
        file?: string | ArrayBuffer | Blob | import("fs").ReadStream;
        sendFileAs?: string;
        encoding?: string;
    };
}
declare module "lib/classes/mapi-request" {
    export = MapiRequest;
    /** @ignore @typedef {import("./mapi-client")} MapiClient */
    /** @ignore @typedef {import("./mapi-response")} MapiResponse */
    /** @ignore @typedef {import("fs").ReadStream} ReadStream */
    /**
     * A Mapbox API request.
     *
     * Note that creating a `MapiRequest` does *not* send the request automatically.
     * Use the request's `send` method to send it off and get a `Promise`.
     *
     * The `emitter` property is an `EventEmitter` that emits the following events:
     *
     * - `'response'` - Listeners will be called with a `MapiResponse`.
     * - `'error'` - Listeners will be called with a `MapiError`.
     * - `'downloadProgress'` - Listeners will be called with `ProgressEvents`.
     * - `'uploadProgress'` - Listeners will be called with `ProgressEvents`.
     *   Upload events are only available when the request includes a file.
     *
     * @class MapiRequest
     * @property {EventEmitter} emitter - An event emitter. See above.
     * @property {MapiClient} client - This request's `MapiClient`.
     * @property {MapiResponse|null} response - If this request has been sent and received
     *   a response, the response is available on this property.
     * @property {MapiError|Error|null} error - If this request has been sent and
     *   received an error in response, the error is available on this property.
     * @property {boolean} aborted - If the request has been aborted
     *   (via [`abort`](#abort)), this property will be `true`.
     * @property {boolean} sent - If the request has been sent, this property will
     *   be `true`. You cannot send the same request twice, so if you need to create
     *   a new request that is the equivalent of an existing one, use
     *   [`clone`](#clone).
     * @property {string} path - The request's path, including colon-prefixed route
     *   parameters.
     * @property {string} origin - The request's origin.
     * @property {string} method - The request's HTTP method.
     * @property {Object} query - A query object, which will be transformed into
     *   a URL query string.
     * @property {Object} params - A route parameters object, whose values will
     *   be interpolated the path.
     * @property {Object} headers - The request's headers.
     * @property {Object|string|null} body - Data to send with the request.
     *   If the request has a body, it will also be sent with the header
     *   `'Content-Type: application/json'`.
     * @property {Blob|ArrayBuffer|string|ReadStream} file - A file to
     *   send with the request. The browser client accepts Blobs and ArrayBuffers;
     *   the Node client accepts strings (filepaths) and ReadStreams.
     * @property {string} encoding - The encoding of the response.
     * @property {string} sendFileAs - The method to send the `file`. Options are
     *   `data` (x-www-form-urlencoded) or `form` (multipart/form-data).
     * @property {*} _nextPageRequest
     */
    /**
     * @ignore
     * @typedef MapiRequestOptions
     * @property {string} method
     * @property {string} path
     * @property {Object} [query={}]
     * @property {Object} [params={}]
     * @property {string} [origin]
     * @property {Object} [headers]
     * @property {Object} [body=null]
     * @property {Blob|ArrayBuffer|string|ReadStream} [file=null]
     * @property {string} [sendFileAs]
     * @property {string} [encoding=utf8]
     */
    class MapiRequest {
        /**
         * @ignore
         * @constructor
         * @param {MapiClient} client
         * @param {MapiRequestOptions} options
         */
        constructor(client: import("lib/classes/mapi-client"), options: MapiRequestOptions);
        id: number;
        _options: MapiRequestOptions;
        emitter: import("eventemitter3")<string | symbol>;
        client: import("lib/classes/mapi-client");
        response: any;
        error: any;
        sent: boolean;
        aborted: boolean;
        path: string;
        method: string;
        origin: string;
        query: any;
        params: any;
        body: any;
        file: string | ArrayBuffer | Blob | import("fs").ReadStream;
        encoding: string;
        sendFileAs: string;
        headers: {};
        _nextPageRequest: any;
        /**
         * Get the URL of the request.
         *
         * @param {string} [accessToken] - By default, the access token of the request's
         *   client is used.
         * @return {string}
         */
        url(accessToken?: string): string;
        /**
         * Send the request. Returns a Promise that resolves with a `MapiResponse`.
         * You probably want to use `response.body`.
         *
         * `send` only retrieves the first page of paginated results. You can get
         * the next page by using the `MapiResponse`'s [`nextPage`](#nextpage)
         * function, or iterate through all pages using [`eachPage`](#eachpage)
         * instead of `send`.
         *
         * @returns {Promise<MapiResponse>}
         */
        send(): Promise<import("lib/classes/mapi-response")>;
        /**
         * Abort the request.
         *
         * Any pending `Promise` returned by [`send`](#send) will be rejected with
         * an error with `type: 'RequestAbortedError'`. If you've created a request
         * that might be aborted, you need to catch and handle such errors.
         *
         * This method will also abort any requests created while fetching subsequent
         * pages via [`eachPage`](#eachpage).
         *
         * If the request has not been sent or has already been aborted, nothing
         * will happen.
         */
        abort(): void;
        /**
         * Invoke a callback for each page of a paginated API response.
         *
         * The callback should have the following signature:
         *
         * ```js
         * (
         *   error: MapiError,
         *   response: MapiResponse,
         *   next: () => void
         * ) => void
         * ```
         *
         * **The next page will not be fetched until you've invoked the
         * `next` callback**, indicating that you're ready for it.
         *
         * @param {Function} callback
         */
        eachPage(callback: Function): void;
        /**
         * Clone this request.
         *
         * Each request can only be sent *once*. So if you'd like to send the
         * same request again, clone it and send away.
         *
         * @returns {MapiRequest} - A new `MapiRequest` configured just like this one.
         */
        clone(): MapiRequest;
        /**
         * @ignore
         * @param {*} [options]
         */
        _extend(options?: any): MapiRequest;
    }
    namespace MapiRequest {
        export { MapiClient, MapiResponse, ReadStream, MapiRequestOptions };
    }
    type MapiRequestOptions = {
        method: string;
        path: string;
        query?: any;
        params?: any;
        origin?: string;
        headers?: any;
        body?: any;
        file?: string | ArrayBuffer | Blob | import("fs").ReadStream;
        sendFileAs?: string;
        encoding?: string;
    };
    type MapiClient = import("lib/classes/mapi-client");
    type MapiResponse = import("lib/classes/mapi-response");
    type ReadStream = import("fs").ReadStream;
}
declare module "lib/classes/mapi-response" {
    export = MapiResponse;
    /** @ignore @typedef {import("./mapi-request")} MapiRequest */
    /**
     * A Mapbox API response.
     *
     * @class MapiResponse
     * @property {Object} body - The response body, parsed as JSON.
     * @property {string} rawBody - The raw response body.
     * @property {number} statusCode - The response's status code.
     * @property {Object} headers - The parsed response headers.
     * @property {Object} links - The parsed response links.
     * @property {MapiRequest} request - The response's originating `MapiRequest`.
     */
    class MapiResponse {
        /**
         * @ignore
         * @constructor
         * @param {MapiRequest} request
         * @param {Object} responseData
         * @param {Object} responseData.headers
         * @param {string} responseData.headers.link
         * @param {string} responseData.body
         * @param {number} responseData.statusCode
         */
        constructor(request: import("lib/classes/mapi-request"), responseData: {
            headers: {
                link: string;
            };
            body: string;
            statusCode: number;
        });
        request: import("lib/classes/mapi-request");
        headers: {
            link: string;
        };
        rawBody: string;
        statusCode: number;
        body: any;
        links: {
            [k: string]: {
                url: string;
                params: {
                    [p: string]: string;
                };
            };
        };
        /**
         * Check if there is a next page that you can fetch.
         *
         * @returns {boolean}
         */
        hasNextPage(): boolean;
        /**
         * Create a request for the next page, if there is one.
         * If there is no next page, returns `null`.
         *
         * @returns {MapiRequest | null}
         */
        nextPage(): import("lib/classes/mapi-request");
    }
    namespace MapiResponse {
        export { MapiRequest };
    }
    type MapiRequest = import("lib/classes/mapi-request");
}
declare module "lib/classes/mapi-error" {
    export = MapiError;
    /** @ignore  @typedef {import("./mapi-request")} MapiRequest */
    /**
     * A Mapbox API error.
     *
     * If there's an error during the API transaction,
     * the Promise returned by `MapiRequest`'s [`send`](#send)
     * method should reject with a `MapiError`.
     *
     * @class MapiError
     * @hideconstructor
     * @property {MapiRequest} request - The errored request.
     * @property {string} type - The type of error. Usually this is `'HttpError'`.
     *   If the request was aborted, so the error was
     *   not sent from the server, the type will be
     *   `'RequestAbortedError'`.
     * @property {number} [statusCode] - The numeric status code of
     *   the HTTP response.
     * @property {Object | string} [body] - If the server sent a response body,
     *   this property exposes that response, parsed as JSON if possible.
     * @property {string} [message] - Whatever message could be derived from the
     *   call site and HTTP response.
     */
    class MapiError {
        /**
         * @ignore
         * @constructor
         * @param {object} options
         * @param {MapiRequest} options.request
         * @param {number} [options.statusCode]
         * @param {string} [options.body]
         * @param {string} [options.message]
         * @param {string} [options.type]
         */
        constructor(options: {
            request: import("lib/classes/mapi-request");
            statusCode?: number;
            body?: string;
            message?: string;
            type?: string;
        });
        message: string;
        type: string;
        statusCode: number;
        request: import("lib/classes/mapi-request");
        body: any;
    }
    namespace MapiError {
        export { MapiRequest };
    }
    type MapiRequest = import("lib/classes/mapi-request");
}
declare module "lib/node/node-layer" {
    export type MapiRequest = import("lib/classes/mapi-request");
    /** @ignore @param {MapiRequest} request */
    export function nodeAbort(request: import("lib/classes/mapi-request")): void;
    /** @ignore @param {MapiRequest} request */
    export function nodeSend(request: import("lib/classes/mapi-request")): Promise<any>;
}
declare module "lib/node/node-client" {
    export = createNodeClient;
    /**
     * Create a client for Node.
     *
     * @param {Object} options
     * @param {string} options.accessToken
     * @param {string} [options.origin]
     * @returns {MapiClient}
     */
    function createNodeClient(options: {
        accessToken: string;
        origin?: string;
    }): import("lib/classes/mapi-client");
    namespace createNodeClient {
        export { MapiClientOptions, MapiClient };
    }
    type MapiClientOptions = {
        accessToken: string;
        origin?: string;
    };
    type MapiClient = import("lib/classes/mapi-client");
}
declare module "lib/client" {
    export = nodeClient;
    var nodeClient: typeof import("lib/node/node-client");
}
declare module "index" {
    export = client;
    var client: typeof import("lib/node/node-client");
}
declare module "lib/helpers/parse-headers" {
    export = parseHeaders;
    /**
     * Parse raw headers into an object with lowercase properties.
     * Does not fully parse headings into more complete data structure,
     * as larger libraries might do. Also does not deal with duplicate
     * headers because Node doesn't seem to deal with those well, so
     * we shouldn't let the browser either, for consistency.
     *
     * @param {string} raw
     * @returns {Object}
     */
    function parseHeaders(raw: string): any;
}
declare module "lib/browser/browser-layer" {
    export function browserAbort(request: any): void;
    export function sendRequestXhr(request: any, xhr: any): Promise<import("lib/classes/mapi-response")>;
    export function browserSend(request: any): Promise<import("lib/classes/mapi-response")>;
    /**
     * The accessToken argument gives this function flexibility
     * for Mapbox's internal client.
     * @ignore
     * @param {*} request
     * @param {string} accessToken
     */
    export function createRequestXhr(request: any, accessToken: string): XMLHttpRequest;
}
declare module "lib/browser/browser-client" {
    export = createBrowserClient;
    /**
     * Create a client for the browser.
     *
     * @param {Object} options
     * @param {string} options.accessToken
     * @param {string} [options.origin]
     * @returns {MapiClient}
     */
    function createBrowserClient(options: {
        accessToken: string;
        origin?: string;
    }): import("lib/classes/mapi-client");
    namespace createBrowserClient {
        export { MapiClientOptions };
    }
    type MapiClientOptions = {
        accessToken: string;
        origin?: string;
    };
}
