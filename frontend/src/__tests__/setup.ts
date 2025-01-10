import '@testing-library/jest-dom';
import { beforeAll, afterEach } from '@jest/globals';

// Setup fetch mock
const globalAny: any = global;
globalAny.fetch = jest.fn();
globalAny.FileReader = jest.fn();

beforeAll(() => {
  // Any global setup can go here
});

afterEach(() => {
  jest.clearAllMocks();
}); 