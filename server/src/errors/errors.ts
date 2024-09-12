export class ScrappingError extends Error {
  constructor(message: string, stack?: string, cause?: Error) {
    super(message);
    this.name = "ScrappingError";
    this.stack = stack;
    this.cause = cause;
  }

  override toString() {
    return `Name: ${this.name},\n Message: ${this.message}\n, Stack: ${this.stack}\n, Cause: ${this.cause}`;
  }
}

export class DbPopulatingError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "DbPopulatingerror";
    this.cause = cause;
  }

  override toString() {
    return `Name: ${this.name},\n Message: ${this.message}\n, Cause: ${this.cause}`;
  }
}
