import request from 'supertest';
import app from '../server';

// Test suite for API endpoints
describe('API Endpoints', () => {
  it('should fetch all categories', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('categories');
    expect(response.body.categories).toBeInstanceOf(Array);
  });

  it('should fetch all definitions', async () => {
    const response = await request(app).get('/api/definitions');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Add more tests for CRUD operations as needed
}); 