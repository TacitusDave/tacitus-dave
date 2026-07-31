export interface HttpStatus {
  code: number;
  title: string;
  description: string;
}

export const HTTP_STATUSES: HttpStatus[] = [
  { code: 100, title: "Continue", description: "The initial part of a request has been received and the client should continue." },
  { code: 101, title: "Switching Protocols", description: "The server is switching protocols as requested by the client." },
  { code: 200, title: "OK", description: "The request succeeded." },
  { code: 201, title: "Created", description: "The request succeeded and a new resource was created." },
  { code: 202, title: "Accepted", description: "The request was accepted for processing, but processing isn't complete." },
  { code: 204, title: "No Content", description: "The request succeeded but there's no content to return." },
  { code: 206, title: "Partial Content", description: "Only part of the resource was returned, per a Range header." },
  { code: 301, title: "Moved Permanently", description: "The resource has been permanently moved to a new URL." },
  { code: 302, title: "Found", description: "The resource is temporarily at a different URL." },
  { code: 304, title: "Not Modified", description: "The cached version is still valid; no need to resend." },
  { code: 307, title: "Temporary Redirect", description: "Like 302, but the request method must not change." },
  { code: 308, title: "Permanent Redirect", description: "Like 301, but the request method must not change." },
  { code: 400, title: "Bad Request", description: "The server couldn't understand the request due to invalid syntax." },
  { code: 401, title: "Unauthorized", description: "Authentication is required and has failed or not been provided." },
  { code: 403, title: "Forbidden", description: "The client doesn't have access rights to the content." },
  { code: 404, title: "Not Found", description: "The server can't find the requested resource." },
  { code: 405, title: "Method Not Allowed", description: "The request method is known but not supported by this resource." },
  { code: 408, title: "Request Timeout", description: "The server timed out waiting for the request." },
  { code: 409, title: "Conflict", description: "The request conflicts with the current state of the resource." },
  { code: 410, title: "Gone", description: "The resource is permanently gone and won't come back." },
  { code: 413, title: "Payload Too Large", description: "The request body is larger than the server can handle." },
  { code: 414, title: "URI Too Long", description: "The requested URI is longer than the server can process." },
  { code: 418, title: "I'm a Teapot", description: "An April Fools' joke from RFC 2324 — a server declining to brew coffee." },
  { code: 422, title: "Unprocessable Entity", description: "The request was well-formed but semantically invalid." },
  { code: 429, title: "Too Many Requests", description: "The client has sent too many requests in a given time." },
  { code: 500, title: "Internal Server Error", description: "A generic error indicating something went wrong on the server." },
  { code: 501, title: "Not Implemented", description: "The server doesn't support the functionality required." },
  { code: 502, title: "Bad Gateway", description: "The server, acting as a gateway, got an invalid response upstream." },
  { code: 503, title: "Service Unavailable", description: "The server isn't ready to handle the request, often during maintenance or overload." },
  { code: 504, title: "Gateway Timeout", description: "The server, acting as a gateway, didn't get a response in time." },
];

export function statusColor(code: number): string {
  if (code < 300) return "#0ca30c";
  if (code < 400) return "#fab219";
  if (code < 500) return "#ec835a";
  return "#d03b3b";
}
