import { describe, expect, test } from '@jest/globals';
import { throwApiError } from "../../helpers/throw_api_error.js";

describe("Throw-API-Error", () => {
  test('throws the API error successfully', () => {
    try {
      throwApiError(400, "Test Error Message", { a: "b" });
    } catch (error) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Test Error Message");
      expect(error.extraAttributes).toBeInstanceOf(Object);
      expect(error.extraAttributes.a).toBe("b");
      expect(error.isOperational).toBeTruthy();

      return;
    }
    throw new Error("Did not throw the API error");
  });
});