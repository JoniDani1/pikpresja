const request = require('supertest');
const { app, server } = require('./server'); // Assuming your Express app is exported from server.js
const { OpenAI } = require('openai');

jest.mock('openai', () => {
  const mockOpenAI = {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'This is corrected text',
              },
            },
          ],
        }),
      },
    },
  };
  return {
    OpenAI: jest.fn(() => mockOpenAI),
  };
});

afterAll((done) => {
  server.close(done);
});

describe('GET /ping', () => {
  it('should return 200 OK and a status message', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'Server is running 🚀' });
    
  });
});

describe('POST, /grammarcheck',()=>{
  it('should return 200 OK and a corrected text on success',async()=>{
    const res = await request(app).post("/grammarcheck").send({text:'some incorrect text'})
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("corrected")
    expect(res.body).toHaveProperty("suggestions")
    expect(res.body.corrected).toEqual('This is corrected text');

  })
})


