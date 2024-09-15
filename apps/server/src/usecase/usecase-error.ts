export class UsecaseError extends Error {
  private _httpHints: number;
  public get httpHints() {
    return this._httpHints;
  }

  constructor(httpHints: number, message = "", options: ErrorOptions = {}) {
    super(message, options);
    this.name = "UsecaseError";
    this._httpHints = httpHints;
  }
}
