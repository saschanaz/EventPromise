/*
The MIT License(MIT)

Copyright(c) 2014 SaschaNaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files(the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module EventPromise {
    export function waitEvent<T extends Event>(target: EventTarget, eventName: string) {
        return new Promise<T>((resolve, reject) => {
            var eventListener = (event: T) => {
                target.removeEventListener(eventName, eventListener);
                resolve(event);
            };
            target.addEventListener(eventName, eventListener);
        });
    }

    export function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any) {
        var oncessation: () => void;
        var onerror: (error: any) => void;
        var subscription: EventSubscription = {
            cease(options: EventCessationOptions = {}) {
                target.removeEventListener(eventName, eventListener);
                if (options.error)
                    onerror(options.error);
                else if (!options.silently)
                    oncessation();
            },
            cessation: new Promise<void>((resolve, reject) => {
                oncessation = () => resolve();
                onerror = (error) => reject(error);
            })
        };

        var eventListener = (event: T) => {
            listener.call(target, event, subscription);
        };
        target.addEventListener(eventName, eventListener);
        return subscription;
    }

    export interface EventSubscription {
        cease(options?: EventCessationOptions): void;
        cessation: Promise<void>
    }

    export interface EventCessationOptions {
        silently?: boolean;
        error?: any;
    }
}