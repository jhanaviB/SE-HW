import { ping, responseTimeCall } from '../src/Client.js'; 
beforeAll(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;   
});

describe('', () => {
  it('ping function should return a number greater than 30ms for average round-trip time', async () => {
    const serverURL = 'http://localhost:2090/';
    const averageRoundTripTime = await ping(serverURL);
    expect(averageRoundTripTime).toBeGreaterThan(30);
  });

  it('ping function should reject with an error for an invalid URL', async () => {
    const invalidURL = 'invalid-url';
    try {
      await ping(invalidURL);
    } catch (error) {
      expect(error).toContain('Invalid URL');
    }
  });  

  it('ping function should have higher round trip time for server located in other continent', async () => {
    const URL = 'https://www.floraindia.com/flowers?gclid=Cj0KCQiAyKurBhD5ARIsALamXaHUhqq-X1EiOCcFCrKXCXSScyL6r0HZQRRPVHicYInbmKx6Yehx_ZQaAhAtEALw_wcB';
    const averageRoundTripTime = await ping(URL);
    expect(averageRoundTripTime).toBeGreaterThan(40);
  });

  it('Response time should return 100% probability of data matching if text is changed after server sends back response', async () => {
      const serverURL = 'http://localhost:2090/';
      const averageRoundTripTime = await ping(serverURL);
      const dataMatch = await responseTimeCall(serverURL,averageRoundTripTime,2);
      expect(dataMatch).toEqual(100);
    });

    it('Response time should return less than 100% probability of data matching if text is changed after server sends back response', async () => {
      const serverURL = 'http://localhost:2090/';
      const averageRoundTripTime = await ping(serverURL);
      const dataMatch = await responseTimeCall(serverURL,averageRoundTripTime,0.8);
      expect(dataMatch).toBeLessThan(100);
    });  

it('Malformed requests to server should return error', async () => {
    const serverURL = 'http://localhost:2090/';
    const myRequest = new Request(serverURL, {
      method: "PUT",
      referrerPolicy: "no-referrer",     
      body: JSON.stringify("Hello"),
      headers: {
          'Contenttype': 'application/json', //Content-Type
      },
  });
  try {
    let response = await fetch(myRequest);
    if (!response.ok) {
        expect(response.status).toEqual(405);
        //throw new Error(`HTTP error! Status: ${response.status}`);
    }
    } catch (error) {
      console.error('Failed request:', error);
    }
  });
        
    });  

  

