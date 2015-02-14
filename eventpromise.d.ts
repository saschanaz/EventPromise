declare module EventPromise {
    function waitEvent<T extends Event>(target: EventTarget, eventName: string): Promise<T>;
    function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
    function subscribeBlank(): EventSubscription;
    interface EventSubscription {
        previous?: EventSubscription;
        cease(options?: EventCessationOptions): void;
        cessation: Promise<void>;
        chain<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
    }
    interface EventCessationOptions {
        silently?: boolean;
        error?: any;
    }
}
interface Contract<T> extends Promise<T> {
    previous?: Contract<any>;
    finish(value?: T): void;
    cancel(reason?: any): void;
    invalidate(): void;
    chain<TNext>(next: (value: T) => Contract<TNext>): Contract<TNext>;
}
interface ContractControl<T> {
    resolve(value?: T | Promise<T>): void;
    reject(reason?: any): void;
    forget(): void;
}
interface ContractEntrance<T> {
    init: (resolve: (value?: T | Promise<T>) => void, reject: (reason?: any) => void) => void;
    revert: () => void;
}
interface ContractConstructor {
    prototype: Contract<any>;
    new <T>(entrance: ContractEntrance<T>): Contract<T>;
    resolve(): Contract<void>;
    reject(): Contract<void>;
}
declare var Contract: ContractConstructor;
