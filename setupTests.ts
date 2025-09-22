import "@testing-library/jest-dom";
global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        "Content-type": "application/json",
      },
    })
  )
) as jest.Mock;
class MockResponse {
  ok: boolean;
  status: number;
  headers: Headers;

  constructor(_body: any, init: any) {
    this.ok = init.status >= 200 && init.status < 300;
    this.status = init.status;
    this.headers = new Headers(init.headers);
  }

  json = jest.fn(() => Promise.resolve({}));
  text = jest.fn(() => Promise.resolve(""));

  static error = jest.fn(() => new MockResponse(null, { status: 0 }));
  static json = jest.fn(
    (data, init) => new MockResponse(JSON.stringify(data), init)
  );
  static redirect = jest.fn(() => new MockResponse(null, { status: 301 }));
}

global.Response = MockResponse as any;
