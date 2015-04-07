class Contract<T> extends Promise<T> {
    previous: Contract<any>;

    finish: (value: T | Promise<T>) => void;
    cancel: (error: any) => void;
    invalidate: () => void;
    
    constructor({init, revert}: ContractEntrance<T>) {
        super((resolve, reject) => {
            var chainedRevert = () => {
                if (this.previous)
                    this.previous.invalidate();
                revert();
            };

            this.finish = (value) => { chainedRevert(); resolve(value); };
            this.cancel = (error) => { chainedRevert(); reject(error) };
            this.invalidate = () => chainedRevert(); 
            init(resolve, reject);
        });
    }
    
    chain<TNext>(next: (value: T) => Contract<TNext>): Contract<TNext> {
        var nextContract = new Contract<TNext>({
            init: (resolve, reject) => {
                this.then((value) => next(value))
                    .then((value) => resolve(value), (reason) => reject(reason));
            },
            revert: () => { }
        });
        nextContract.previous = this;
        return nextContract;
    }
}