const ERROR_CODES = [
  "INCORRECT_PASSWORD",
  "INTERNAL_ERROR",
  "USER_NOT_EXISTS",
  "DUPLICATED_USER",
  "INVALID_PASSWORD",
  "INVALID_RESET_PASSWORD_LINK",
  "TOO_MANY_TRIES",
  "UNAUTHORIZED",
  "CUSTOMER_NOT_EXISTS",
  "EMAIL_ALREADY_EXISTS",
  "EMAIL_CANNOT_BE_EMPTY",
  "NO_CUSTOMERS",
  "TAX_ID_CANNOT_BE_EMPTY",
  "VOUCHER_ID_CANNOT_BE_EMPTY",
  "JOB_NOT_EXISTS",
] as const;

export type ErrorCode = typeof ERROR_CODES[number];

export const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === "string" && ERROR_CODES.includes(value as ErrorCode);

export const extractErrorCode = (error: Error | undefined) => {
  let errorCode: ErrorCode | null = null;
  if (error) {
    errorCode = isErrorCode(error.message) ? error.message : "INTERNAL_ERROR";
  }
  return errorCode;
};

export type ErrorResponse = {
  response: { status: number };
};

export const isErrorResponse = (value: unknown): value is ErrorResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "response" in value &&
    typeof (value as ErrorResponse)["response"] === "object" &&
    (value as ErrorResponse)["response"] !== null &&
    "status" in (value as ErrorResponse)["response"] &&
    typeof (value as ErrorResponse)["response"]["status"] === "number"
  );
};
