EventPromise
============

Listen events more easily with promises.

# API

```typescript
declare module EventPromise {
  function waitEvent<T extends Event>(target: EventTarget, eventName: string): Promise<T>;
  function subscribeEvent<T extends Event>(
    target: EventTarget,
    eventName: string,
    listener: (ev: T, subscription: EventSubscription) => any
  ): EventSubscription;
  function subscribeBlank(): EventSubscription;

  interface EventSubscription {
    cease(options?: EventCessationOptions): void;
    cessation: Promise<void>;
    chain<T extends Event>(
      target: EventTarget,
      eventName: string,
      listener: (ev: T, subscription: EventSubscription) => any
    ): EventSubscription;
  }
  interface EventCessationOptions {
    silently?: boolean;
    error?: any;
  }
}


```

# Example

### One-time click listener

```javascript
EventPromise.waitEvent(window, "click")
  .then(function () { alert("First click") });
```

### Promise-izing XHR

```javascript
function xhr(method, url) {
  var request = new XMLHttpRequest();
  request.open(method, url)
  var promise = EventPromise.waitEvent(request, "load");
  request.send();
  return promise;
}
```

### Normal event subscription

```javascript
EventPromise.subscribeEvent(window, "resize", function () { alert("Window is resized") });
```

### Ceasing subscripton

```javascript
EventPromise.subscribeEvent(window, "resize",
  function (ev, subscription) {
  console.log("Window is resized");
  if (window.innerWidth > 640)
    subscription.cease();
  });
```

### External ceasing

```javascript
var subscription = EventPromise.subscribeEvent(window, "click", function () { alert("Clicked") });
EventPromise.waitEvent(window, "scroll").then(function () { subscription.cease() });
```

### Waiting subscription cessation

```javascript
EventPromise.subscribeEvent(window, "keydown",
  function (ev, subscription) {
  if (ev.key !== 'p')
    alert("Please press 'P'");
  else
    subscription.cease();
  })
  .cessation.then(function () { alert("You pressed P. Thanks. Test end.") });
```

### Chaining event listeners

##### Using waitEvent

```javascript
EventPromise.waitEvent(window, "click")
  .then(function () { alert("Just cleared level 1"); return EventPromise.waitEvent(window, "keydown") })
  .then(function () { alert("Just cleared level 2"); return EventPromise.waitEvent(window, "scroll") })
  .then(function () { alert("Chain event completed") });
```

##### Using EventSubscription.chain

```javascript
var chains = EventPromise.subscribeEvent(window, "keydown", function (ev, subscription) {
  if (ev.key === "x")
    subscription.cease();
  console.log("First " + ev.key);
}).chain(window, "keydown", function (ev, subscription) {
  if (ev.key === "y")
    subscription.cease();
  console.log("Second " + ev.key);
});

// Ceasing chained subscriptions at once
EventPromise.waitEvent(window, "click").then(function () { chains.cease() });
```

##### Infinite chain

```javascript
var chained = EventPromise.subscribeBlank();

var repeat = function () {
  chained = chained.chain(window, "keydown", function (ev, subscription) {
    if (ev.key === "x")
      subscription.cease();
    console.log("First " + ev.key);
  }).chain(window, "keydown", function (ev, subscription) {
    if (ev.key === "y")
      subscription.cease();
    console.log("Second " + ev.key);
  }).chain(window, "keydown", function (ev, subscription) {
    if (ev.key === "z") {
      subscription.cease();
      
      /* infinite chaining! */
      repeat();
    }
    console.log("Third " + ev.key);
  });
}

repeat();
```
