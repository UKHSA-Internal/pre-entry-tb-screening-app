import { vi } from "vitest";

// Mock functions for SQService methods
export const sendDbStreamMessageMock = vi.fn();
export const sendToDLQMock = vi.fn();

// Mocked SQService class
export class SQService {
  sendDbStreamMessage = sendDbStreamMessageMock;
  sendToDLQ = sendToDLQMock;
}
