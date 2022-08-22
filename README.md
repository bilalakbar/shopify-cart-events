## Shopify Cart Events

This is not a library but more of a hacked together script to listen to Shopify Cart Events.

[Shopify Cart API](https://shopify.dev/api/ajax/reference/cart) allows creating and modifying cart via AJAX. Sometimes, you want to perform some different action or simply detect if contents of cart have changed. Shopify does not provide any standard events for that. However, some themes may implement custom Events for Cart updates but it is difficult to rely on those in case you are working on a standalone Shopify app.

## How to Use ?

Download the package from [Release page](https://github.com/bilalakbar/shopify-cart-events/releases) or copy the code from Github (**index.min.js**) and load it on your Shopify website. Ideally before loading your custom JavaScript. In case of standalone Shopify app, you can ship it as part of your custom JavaScript file.

**Listen to Cart Events**

This script fires 5 events.

- **SCE:mutate** - anytime Cart was updated. Successful call to add, update, change or clear
- **SCE:add** - anytime successful call to **add** endpoint of Shopify Cart API
- **SCE:update** - anytime successful call to **update** endpoint of Shopify Cart API
- **SCE:change** - anytime successful call to **change** endpoint of Shopify Cart API
- **SCE:clear** - anytime successful call to **clear** endpoint of Shopify Cart API

```
  window.addEventListener('SCE:mutate', (event) => {
    // event.detail will be Shopify Cart object
  })

  window.addEventListener('SCE:add', (event) => {
    // event.detail will be Shopify Cart object
  })

  window.addEventListener('SCE:update', (event) => {
    // event.detail will be Shopify Cart object
  })

  window.addEventListener('SCE:change', (event) => {
    // event.detail will be Shopify Cart object
  })

  window.addEventListener('SCE:clear', (event) => {
    // event.detail will be Shopify Cart object
  })
  
```

## How this works ?

This works by Monkey Patching the **XMLHttpRequest.prototype.open** and **fetch** function on **window** object.

## Why ?

Wrote related answer [here](https://stackoverflow.com/questions/63450607/listen-to-shopify-cart-update-quantity/63505699#63505699) and [here](https://stackoverflow.com/questions/64236128/script-tag-xhr-event-listener-for-monitoring-cart-activities-does-not-work-anymo/64241104#64241104) on Stack Overflow.
