(function () {
  if (!window || !window.Shopify) return;

  const CartEvents = {
    add: "SCE:add",
    update: "SCE:update",
    change: "SCE:change",
    clear: "SCE:clear",
    mutate: "SCE:mutate",
  };

  const ShopifyCartURLs = [
    "/cart/add",
    "/cart/update",
    "/cart/change",
    "/cart/clear",
    "/cart/add.js",
    "/cart/update.js",
    "/cart/change.js",
    "/cart/clear.js",
  ];

  function isShopifyCartURL(url) {
    if (!url) return false;
    const path = url.split("/").pop();
    return ShopifyCartURLs.includes(`/cart/${path}`);
  }

  function updateType(url) {
    if (!url) return false;
    if (url.includes("cart/add")) {
      return "add";
    } else if (url.includes("cart/update")) {
      return "update";
    } else if (url.includes("cart/change")) {
      return "change";
    } else if (url.includes("cart/clear")) {
      return "clear";
    } else return false;
  }

  function dispatchEvent(url, detail) {
    if (typeof detail === "string") {
      try {
        detail = JSON.parse(detail);
      } catch {}
    }

    window.dispatchEvent(new CustomEvent(CartEvents.mutate, { detail }));
    const type = updateType(url);
    switch (type) {
      case "add":
        window.dispatchEvent(new CustomEvent(CartEvents.add, { detail }));
        break;
      case "update":
        window.dispatchEvent(new CustomEvent(CartEvents.update, { detail }));
        break;
      case "change":
        window.dispatchEvent(new CustomEvent(CartEvents.change, { detail }));
        break;
      case "clear":
        window.dispatchEvent(new CustomEvent(CartEvents.clear, { detail }));
        break;
      default:
        break;
    }
  }

  function XHROverride() {
    if (!window.XMLHttpRequest) return;

    const originalOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
      const url = arguments[1];
      this.addEventListener("load", function () {
        if (isShopifyCartURL(url)) {
          dispatchEvent(url, this.response);
        }
      });
      return originalOpen.apply(this, arguments);
    };
  }

  function fetchOverride() {
    if (!window.fetch || typeof window.fetch !== "function") return;
    const originalFetch = window.fetch;
    window.fetch = function () {
      const response = originalFetch.apply(this, arguments);

      if (isShopifyCartURL(arguments[0])) {
        response.then((res) => {
          res
            .clone()
            .json()
            .then((data) => dispatchEvent(res.url, data));
        });
      }

      return response;
    };
  }

  fetchOverride();
  XHROverride();
})();
