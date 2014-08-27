declare module EventPromise {
    function waitEvent<T extends Event>(target: EventTarget, eventName: string): Promise<T>;
    function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
    interface EventSubscription {
        cease(): void;
        cessation: Promise<void>;
    }
}
