EventPromise
============

# API

```typescript
declare module EventPromise {
  function waitEvent<T extends Event>(target: EventTarget, eventName: string): Promise<T>;
  function subscribeEvent<T extends Event>(
    target: EventTarget,
    eventName: string,
    listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
  
  interface EventSubscription {
    cease(options?: EventCessationOptions): void;
    cessation: Promise<void>;
  }
  interface EventCessationOptions {
    silently?: boolean;
    error?: any;
  }
}


```

# Example

```javascript
// One-time click listener
EventPromise.waitEvent(window, "click")
  .then(function () { alert("First click") });

// Promise-izing XHR
function xhr(method, url) {
  var request = new XMLHttpRequest();
  request.open(method, url)
  var promise = EventPromise.waitEvent(request, "load");
  request.send();
  return promise;
}

// Normal event subscription
EventPromise.subscribeEvent(window, "resize", function () { alert("Window is resized") });

// Ceasing subscripton
EventPromise.subscribeEvent(window, "resize",
  function (ev, subscription) {
  console.log("Window is resized");
  if (window.innerWidth > 640)
    subscription.cease();
  });

// External ceasing
var subscription = EventPromise.subscribeEvent(window, "click", function () { alert("Clicked") });
EventPromise.waitEvent(window, "scroll").then(function () { subscription.cease() });

// Waiting subscription cessation
EventPromise.subscribeEvent(window, "keydown",
  function (ev, subscription) {
  if (ev.key !== 'p')
    alert("Please press 'P'");
  else
    subscription.cease();
  })
  .cessation.then(function () { alert("You pressed P. Thanks. Test end.") });

// Chaining event listeners
EventPromise.waitEvent(window, "click")
  .then(function () { alert("Just cleared level 1"); return EventPromise.waitEvent(window, "keydown") })
  .then(function () { alert("Just cleared level 2"); return EventPromise.waitEvent(window, "scroll") })
  .then(function () { alert("Chain event completed") });
```
