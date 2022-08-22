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

  function normalizeURL(url) {
    if (!url) return false;
    return url.split("/").pop();
  }

  function dispatchEvent(url, detail) {
    if (typeof detail === "string") {
      try {
        detail = JSON.parse(detail);
      } catch {}
    }

    window.dispatchEvent(new CustomEvent(CartEvents.mutate, { detail }));
    const urlSuffix = normalizeURL(url);
    switch (urlSuffix) {
      case "add.js":
        window.dispatchEvent(new CustomEvent(CartEvents.add, { detail }));
        break;
      case "update.js":
        window.dispatchEvent(new CustomEvent(CartEvents.update, { detail }));
        break;
      case "change.js":
        window.dispatchEvent(new CustomEvent(CartEvents.change, { detail }));
        break;
      case "clear.js":
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
