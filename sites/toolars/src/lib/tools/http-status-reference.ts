export type HttpStatusCategory = "Informational" | "Success" | "Redirection" | "Client Error" | "Server Error";

export interface HttpStatusRow {
  code: number;
  phrase: string;
  category: HttpStatusCategory;
  description: string;
}

export interface HttpStatusLookupInput {
  query: string;
  category?: HttpStatusCategory | "All";
}

export interface HttpStatusLookupResult {
  matches: HttpStatusRow[];
  summary: string;
  privacyNote: string;
}

const statuses: HttpStatusRow[] = [
  { code: 100, phrase: "Continue", category: "Informational", description: "The initial part of a request was received." },
  { code: 200, phrase: "OK", category: "Success", description: "The request succeeded." },
  { code: 201, phrase: "Created", category: "Success", description: "The request succeeded and created a resource." },
  { code: 204, phrase: "No Content", category: "Success", description: "The request succeeded without a response body." },
  { code: 301, phrase: "Moved Permanently", category: "Redirection", description: "The resource moved to a new permanent URL." },
  { code: 302, phrase: "Found", category: "Redirection", description: "The resource is temporarily available elsewhere." },
  { code: 400, phrase: "Bad Request", category: "Client Error", description: "The request could not be understood by the server." },
  { code: 401, phrase: "Unauthorized", category: "Client Error", description: "Authentication is required." },
  { code: 403, phrase: "Forbidden", category: "Client Error", description: "The client is not allowed to access the resource." },
  { code: 404, phrase: "Not Found", category: "Client Error", description: "The requested resource was not found." },
  { code: 409, phrase: "Conflict", category: "Client Error", description: "The request conflicts with current resource state." },
  { code: 422, phrase: "Unprocessable Content", category: "Client Error", description: "The request was syntactically valid but semantically invalid." },
  { code: 429, phrase: "Too Many Requests", category: "Client Error", description: "The client has sent too many requests." },
  { code: 500, phrase: "Internal Server Error", category: "Server Error", description: "The server hit an unexpected condition." },
  { code: 502, phrase: "Bad Gateway", category: "Server Error", description: "An upstream server returned an invalid response." },
  { code: 503, phrase: "Service Unavailable", category: "Server Error", description: "The server is not ready to handle the request." }
];

export function lookupHttpStatuses({ query, category = "All" }: HttpStatusLookupInput): HttpStatusLookupResult {
  const normalized = query.trim().toLowerCase();
  const matches = statuses.filter((status) => {
    const categoryMatches = category === "All" || status.category === category;
    const queryMatches =
      !normalized ||
      String(status.code).includes(normalized) ||
      status.phrase.toLowerCase().includes(normalized) ||
      status.description.toLowerCase().includes(normalized);
    return categoryMatches && queryMatches;
  });

  return {
    matches,
    summary: `${matches.length.toLocaleString("en-US")} ${matches.length === 1 ? "status" : "statuses"} found.`,
    privacyNote: "HTTP status lookup runs locally in the browser."
  };
}
