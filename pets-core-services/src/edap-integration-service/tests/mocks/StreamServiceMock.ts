import { Mock, vi } from "vitest";

// Mock function for the static method
export const getClinicDataStreamMock: Mock = vi.fn();

// Mocked StreamService class
export class StreamService {
  public static readonly getClinicDataStream = getClinicDataStreamMock;
}
