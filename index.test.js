/**
 * @jest-environment jsdom
 */
import "whatwg-fetch";
import nock from "nock";

const MockCartResponse = {
  token: "1d19a32178501c44ef2223d73c54d16d",
  note: null,
  attributes: {},
  total_price: 0,
  total_weight: 0,
  item_count: 0,
  items: [],
  requires_shipping: false,
  currency: "CAD",
};

const fetchRequest = async (url) => {
  const response = await fetch(`cart/${url}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  const data = await response.json();
  return data;
};

const XHRRequest = async (url) => {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `cart/${url}`);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject();
      }
    };
    xhr.onerror = () => reject();

    xhr.send();
  });
};

beforeAll(() => {
  nock(/.*/).persist().post(/.*/).reply(200, MockCartResponse);
});

describe("checks for Cart Response without patching Fetch", () => {
  test("add request", async () => {
    const data = await fetchRequest("add");
    expect(data).toMatchObject(MockCartResponse);
  });

  test("update request", async () => {
    const data = await fetchRequest("update");
    expect(data).toMatchObject(MockCartResponse);
  });

  test("change request", async () => {
    const data = await fetchRequest("change");
    expect(data).toMatchObject(MockCartResponse);
  });

  test("clear request", async () => {
    const data = await fetchRequest("clear");
    expect(data).toMatchObject(MockCartResponse);
  });
});

describe("checks for Cart Response without patching XHR", () => {
  test("add frequest", async () => {
    const data = await XHRRequest("add");
    expect(data).toMatchObject(MockCartResponse);
  });

  test("update request", async () => {
    const data = await XHRRequest("update");
    expect(data).toMatchObject(MockCartResponse);
  });

  test("change request", async () => {
    const data = await XHRRequest("change");
    expect(data).toMatchObject(MockCartResponse);
  });

  test("clear request", async () => {
    const data = await XHRRequest("clear");
    expect(data).toMatchObject(MockCartResponse);
  });
});

describe("check that function is patched", () => {
  beforeAll(() => {
    import("./index");
  });

  test("checks that functions are patched", async () => {
    const openDefinition = window.XMLHttpRequest.prototype.open.toString();
    const fetchDefinition = window.fetch.toString();
    expect(openDefinition).toEqual(expect.stringContaining("isShopifyCartURL"));
    expect(fetchDefinition).toEqual(
      expect.stringContaining("isShopifyCartURL")
    );
  });

  describe("checks for Cart Response and Events", () => {
    let responseMap = {};
    const events = [
      "SCE:mutate",
      "SCE:add",
      "SCE:update",
      "SCE:change",
      "SCE:clear",
    ];
    const eventCallback = (name) => {
      return function (event) {
        responseMap[name] = event.detail;
      };
    };

    beforeAll(() => {
      events.map((name) => window.addEventListener(name, eventCallback(name)));
    });

    afterAll(() => {
      events.map((name) =>
        window.removeEventListener(name, eventCallback(name))
      );
    });

    beforeEach(() => {
      responseMap = {};
    });

    describe("XHR", () => {
      test("add request", async () => {
        const data = await XHRRequest("add");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:add"]).toMatchObject(MockCartResponse);
      });

      test("update request", async () => {
        const data = await XHRRequest("update");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:update"]).toMatchObject(MockCartResponse);
      });

      test("change request", async () => {
        const data = await XHRRequest("change");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:change"]).toMatchObject(MockCartResponse);
      });

      test("clear request", async () => {
        const data = await XHRRequest("clear");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:clear"]).toMatchObject(MockCartResponse);
      });
    });

    describe("Fetch", () => {
      test("add request", async () => {
        const data = await fetchRequest("add");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:add"]).toMatchObject(MockCartResponse);
      });

      test("update request", async () => {
        const data = await fetchRequest("update");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:update"]).toMatchObject(MockCartResponse);
      });

      test("change request", async () => {
        const data = await fetchRequest("change");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:change"]).toMatchObject(MockCartResponse);
      });

      test("clear request", async () => {
        const data = await fetchRequest("clear");
        expect(data).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:mutate"]).toMatchObject(MockCartResponse);
        expect(responseMap["SCE:clear"]).toMatchObject(MockCartResponse);
      });
    });
  });
});
