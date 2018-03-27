export declare interface Binder<T> {
    getValue(): T;

    setValue(this: Binder<boolean>, value: boolean, force?: boolean): Binder<boolean>;
    setValue(this: Binder<number>, value: number, force?: boolean): Binder<number>;
    setValue(this: Binder<string>, value: string, force?: boolean): Binder<string>;
    setValue(this: Binder<Date>, value: Date, force?: boolean): Binder<Date>;

    setValue<Q>(this: Binder<Q[]>, value: Q[], force?: boolean): ArrayBinder<Q>;
    setValue<Q>(this: Binder<ObjectMap<Q>>, value: ObjectMap<Q>, force?: boolean): MapBinder<Q>
    setValue<Q extends Object>(this: Binder<Q>, value: Q, force?: boolean): ObjectBinder<Q>

    setValue(value: T, force?: boolean): Binder<T>;

    toString(): string;
    toLocaleString(locales?: string | string[], options?: any): string;

    hasValue(this: Binder<boolean | undefined | null>): this is Binder<boolean>;
    hasValue(this: Binder<number | undefined | null>): this is Binder<number>;
    hasValue(this: Binder<string | undefined | null>): this is Binder<string>;
    hasValue(this: Binder<Date | undefined | null>): this is Binder<Date>;

    hasValue<Q>(this: Binder<Q[] | undefined | null>): this is ArrayBinder<Q>;
    hasValue<Q>(this: Binder<ObjectMap<Q> | undefined | null>): this is MapBinder<Q>;
    hasValue<Q extends Object>(this: Binder<Q | undefined | null>): this is ObjectBinder<Q>;

    hasValue(): boolean;

    _(this: Binder<boolean>): Binder<boolean>;
    _(this: Binder<number>): Binder<number>;
    _(this: Binder<string>): Binder<string>;
    _(this: Binder<Date>): Binder<Date>;

    _<Q>(this: Binder<Q[]>): ArrayBinder<Q>;
    _<Q>(this: Binder<ObjectMap<Q>>): MapBinder<Q>;
    _<Q extends Object>(this: Binder<Q>): ObjectBinder<Q>;

    _(): Binder<T>;

    // Additional information
    getExtras(): any;
    getParent(): Binder<any> | null;
    getKey(): string | number | null;
    isValidBinder(): boolean;
    getDerivedFrom(): DerivedBinderFrom | null;

    // Binder type information
    isValueBinder(): this is Binder<T>;

    isObjectBinder(this: Binder<boolean>): boolean;
    isObjectBinder(this: Binder<number>): boolean;
    isObjectBinder(this: Binder<string>): boolean;
    isObjectBinder(this: Binder<Date>): boolean;

    isObjectBinder<Q>(this: Binder<Q[]>): boolean;
    isObjectBinder<Q>(this: Binder<ObjectMap<Q>>): boolean;
    isObjectBinder<Q extends Object>(this: Binder<Q>): this is ObjectBinder<Q>;

    isObjectBinder(): boolean;

    isMapBinder<Q>(this: Binder<ObjectMap<Q>>): this is MapBinder<Q>;
    isMapBinder(): boolean;

    isArrayBinder<Q>(this: Binder<Q[]>): this is ArrayBinder<Q>;
    isArrayBinder<Q>(): boolean;
    
    // advanced updates
    updateExtras(this: Binder<boolean>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<boolean>;
    updateExtras(this: Binder<number>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<number>;
    updateExtras(this: Binder<string>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<string>;
    updateExtras(this: Binder<Date>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<Date>;

    updateExtras<Q>(this: Binder<Q[]>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): ArrayBinder<Q>;
    updateExtras<Q>(this: Binder<ObjectMap<Q>>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): MapBinder<Q>
    updateExtras<Q extends Object>(this: Binder<Q>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): ObjectBinder<Q>

    updateExtras(newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<T>;
    
    setValueAndUpdateExtras(this: Binder<boolean>, value: boolean, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<boolean>;
    setValueAndUpdateExtras(this: Binder<number>, value: number, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<number>;
    setValueAndUpdateExtras(this: Binder<string>, value: string, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<string>;
    setValueAndUpdateExtras(this: Binder<Date>, value: Date, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<Date>;

    setValueAndUpdateExtras<Q>(this: Binder<Q[]>, value: Q[], newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): ArrayBinder<Q>;
    setValueAndUpdateExtras<Q>(this: Binder<ObjectMap<Q>>, value: ObjectMap<Q>, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): MapBinder<Q>
    setValueAndUpdateExtras<Q extends Object>(this: Binder<Q>, value: Q, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): ObjectBinder<Q>

    setValueAndUpdateExtras(value: T, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<T>;
    
    updateExtrasInCurrentBinder(newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}): void;
}

export declare interface ArrayBinder<T> extends Binder<T[]> {
    length: number;
    readonly [index: number]: Binder<T>;

    get(this: ArrayBinder<boolean>, index: number): Binder<boolean>;
    get(this: ArrayBinder<number>, index: number): Binder<number>;
    get(this: ArrayBinder<string>, index: number): Binder<string>;
    get(this: ArrayBinder<Date>, index: number): Binder<Date>;

    get<Q>(this: ArrayBinder<Q[]>, index: number): ArrayBinder<Q>;
    get<Q>(this: ArrayBinder<ObjectMap<Q>>, index: number): MapBinder<Q>;
    get<Q extends Object>(this: ArrayBinder<Q>, index: number): ObjectBinder<Q>;
    get(index: number): Binder<T>;

    set(index: number, value: T): ArrayBinder<T>;

    // Basic array mutator
    splice(start: number, deleteCount?: number): ArrayBinder<T>;
    splice(start: number, deleteCount: number, ...items: T[]): ArrayBinder<T>;

    // Array mutator
    pop(): ArrayBinder<T>;
    push(...items: T[]): ArrayBinder<T>;
    shift(): ArrayBinder<T>;
    unshift(...items: T[]): ArrayBinder<T>;

    // Extra mutator
    insertAt(index: number, value: T): ArrayBinder<T>;
    removeAt(index: number, deleteCount?: number): ArrayBinder<T>;

    // Other methods
    concat(...items: ArrayBinder<T>[]): Binder<T>[];
    concat(...items: (Binder<T> | Binder<T>[] | ReadonlyArray<Binder<T> | ArrayBinder<T>>)[]): Binder<T>[];
    join(separator?: string): string;
    slice(start?: number, end?: number): Binder<T>[];

    // Search in an Array
    includes(searchElement: T, fromIndex?: number): boolean;
    includes(searchElement: Binder<T>, fromIndex?: number): boolean;
    indexOf(searchElement: T, fromIndex?: number): number;
    indexOf(searchElement: Binder<T>, fromIndex?: number): number;
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    lastIndexOf(searchElement: Binder<T>, fromIndex?: number): number;

    // Iterator

    forEach(this: ArrayBinder<boolean>, callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach(this: ArrayBinder<number>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach(this: ArrayBinder<string>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach(this: ArrayBinder<Date>,    callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach<Q>(this: ArrayBinder<Q[]>, callbackfn: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach<Q>(this: ArrayBinder<ObjectMap<Q>>, callbackfn: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach<Q extends Object>(this: ArrayBinder<Q>, callbackfn: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => void): void;
    forEach(callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => void): void;

    every(this: ArrayBinder<boolean>, callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every(this: ArrayBinder<number>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every(this: ArrayBinder<string>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every(this: ArrayBinder<Date>,    callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every<Q>(this: ArrayBinder<Q[]>, callbackfn: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every<Q>(this: ArrayBinder<ObjectMap<Q>>, callbackfn: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every<Q extends Object>(this: ArrayBinder<Q>, callbackfn: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    every(callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;

    some(this: ArrayBinder<boolean>, callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some(this: ArrayBinder<number>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some(this: ArrayBinder<string>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some(this: ArrayBinder<Date>,    callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some<Q>(this: ArrayBinder<Q[]>, callbackfn: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some<Q>(this: ArrayBinder<ObjectMap<Q>>, callbackfn: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some<Q extends Object>(this: ArrayBinder<Q>, callbackfn: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;
    some(callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): boolean;

    map<U>(this: ArrayBinder<boolean>, callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U>(this: ArrayBinder<number>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U>(this: ArrayBinder<string>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U>(this: ArrayBinder<Date>,    callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U, Q>(this: ArrayBinder<Q[]>, callbackfn: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U, Q>(this: ArrayBinder<ObjectMap<Q>>, callbackfn: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U, Q extends Object>(this: ArrayBinder<Q>, callbackfn: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];
    map<U>(callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => U): U[];

    filter(this: ArrayBinder<boolean>, callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T>[];
    filter(this: ArrayBinder<number>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T>[];
    filter(this: ArrayBinder<string>,  callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T>[];
    filter(this: ArrayBinder<Date>,    callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T>[];
    filter<Q>(this: ArrayBinder<Q[]>, callbackfn: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): ArrayBinder<Q>[];
    filter<Q>(this: ArrayBinder<ObjectMap<Q>>, callbackfn: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): MapBinder<Q>[];
    filter<Q extends Object>(this: ArrayBinder<Q>, callbackfn: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): ObjectBinder<Q>[];
    filter(callbackfn: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T>[];

    find(this: ArrayBinder<boolean>, predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T> | undefined;
    find(this: ArrayBinder<number>,  predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T> | undefined;
    find(this: ArrayBinder<string>,  predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T> | undefined;
    find(this: ArrayBinder<Date>,    predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T> | undefined;
    find<Q>(this: ArrayBinder<Q[]>, predicate: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): ArrayBinder<Q> | undefined;
    find<Q>(this: ArrayBinder<ObjectMap<Q>>, predicate: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): MapBinder<Q> | undefined;
    find<Q extends Object>(this: ArrayBinder<Q>, predicate: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): ObjectBinder<Q> | undefined;
    find(predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): Binder<T> | undefined;

    findIndex(this: ArrayBinder<boolean>, predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex(this: ArrayBinder<number>,  predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex(this: ArrayBinder<string>,  predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex(this: ArrayBinder<Date>,    predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex<Q>(this: ArrayBinder<Q[]>, predicate: (value: ArrayBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex<Q>(this: ArrayBinder<ObjectMap<Q>>, predicate: (value: MapBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex<Q extends Object>(this: ArrayBinder<Q>, predicate: (value: ObjectBinder<Q>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;
    findIndex(predicate: (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => boolean): number;

    reduce(this: ArrayBinder<boolean>, predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduce(this: ArrayBinder<number>,  predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduce(this: ArrayBinder<string>,  predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduce(this: ArrayBinder<Date>,    predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduce<Q>(this: ArrayBinder<Q[]>, predicate: (previousValue: ArrayBinder<Q>, currentValue: ArrayBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => ArrayBinder<Q>, initialValue?: ArrayBinder<Q>): ArrayBinder<Q>;
    reduce<Q>(this: ArrayBinder<ObjectMap<Q>>, predicate: (previousValue: MapBinder<Q>, currentValue: MapBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => MapBinder<Q>, initialValue?: MapBinder<Q>): MapBinder<Q>;
    reduce<Q extends Object>(this: ArrayBinder<Q>, predicate: (previousValue: ObjectBinder<Q>, currentValue: ObjectBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => ObjectBinder<Q>, initialValue?: ObjectBinder<Q>): ObjectBinder<Q>;
    reduce(predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;

    reduce<U>(this: ArrayBinder<boolean>, predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U>(this: ArrayBinder<number>,  predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U>(this: ArrayBinder<string>,  predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U>(this: ArrayBinder<Date>,    predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U, Q>(this: ArrayBinder<Q[]>, predicate: (previousValue: U, currentValue: ArrayBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U, Q>(this: ArrayBinder<ObjectMap<Q>>, predicate: (previousValue: U, currentValue: MapBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U, Q extends Object>(this: ArrayBinder<Q>, predicate: (previousValue: U, currentValue: ObjectBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduce<U>(predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;

    reduceRight(this: ArrayBinder<boolean>, predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduceRight(this: ArrayBinder<number>,  predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduceRight(this: ArrayBinder<string>,  predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduceRight(this: ArrayBinder<Date>,    predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;
    reduceRight<Q>(this: ArrayBinder<Q[]>, predicate: (previousValue: ArrayBinder<Q>, currentValue: ArrayBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => ArrayBinder<Q>, initialValue?: ArrayBinder<Q>): ArrayBinder<Q>;
    reduceRight<Q>(this: ArrayBinder<ObjectMap<Q>>, predicate: (previousValue: MapBinder<Q>, currentValue: MapBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => MapBinder<Q>, initialValue?: MapBinder<Q>): MapBinder<Q>;
    reduceRight<Q extends Object>(this: ArrayBinder<Q>, predicate: (previousValue: ObjectBinder<Q>, currentValue: ObjectBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => ObjectBinder<Q>, initialValue?: ObjectBinder<Q>): ObjectBinder<Q>;
    reduceRight(predicate: (previousValue: Binder<T>, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => Binder<T>, initialValue?: Binder<T>): Binder<T>;

    reduceRight<U>(this: ArrayBinder<boolean>, predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U>(this: ArrayBinder<number>,  predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U>(this: ArrayBinder<string>,  predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U>(this: ArrayBinder<Date>,    predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U, Q>(this: ArrayBinder<Q[]>, predicate: (previousValue: U, currentValue: ArrayBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U, Q>(this: ArrayBinder<ObjectMap<Q>>, predicate: (previousValue: U, currentValue: MapBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U, Q extends Object>(this: ArrayBinder<Q>, predicate: (previousValue: U, currentValue: ObjectBinder<Q>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
    reduceRight<U>(predicate: (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U, initialValue: U): U;
}

export type ObjectBinderByKey<T> = {
    readonly [K in keyof T]: ObjectBinder<T[K]>;
    // Key get and set: not available in order to avoid conflicts with false object binders
}
export type ObjectBinder<T> = Binder<T> & ObjectBinderByKey<T>;

export interface ObjectMap<I> {
    [key: string]: I | undefined;
}

export declare interface MapBinder<T> extends Binder<ObjectMap<T>> {
    size: number;

    get(this: MapBinder<boolean>, key: string): Binder<boolean> | undefined;
    get(this: MapBinder<number>, key: string): Binder<number> | undefined;
    get(this: MapBinder<string>, key: string): Binder<string> | undefined;
    get(this: MapBinder<Date>, key: string): Binder<Date> | undefined;

    get<Q>(this: MapBinder<Q[]>, key: string): ArrayBinder<Q> | undefined;
    get<Q>(this: MapBinder<ObjectMap<Q>>, key: string): MapBinder<Q> | undefined;
    get<Q extends Object>(this: MapBinder<Q>, key: string): ObjectBinder<Q> | undefined;
    get(key: string): Binder<T> | undefined;

    set(key: string, value: T): MapBinder<T>;
    
    clear(): MapBinder<T>;
    delete(key: string): MapBinder<T>;
    has(key: string): boolean;

    forEach(this: MapBinder<boolean>, callbackfn: (value: Binder<T>, key: string, mapBinder: MapBinder<T>) => void): void;
    forEach(this: MapBinder<number>,  callbackfn: (value: Binder<T>, key: string, mapBinder: MapBinder<T>) => void): void;
    forEach(this: MapBinder<string>,  callbackfn: (value: Binder<T>, key: string, mapBinder: MapBinder<T>) => void): void;
    forEach(this: MapBinder<Date>,    callbackfn: (value: Binder<T>, key: string, mapBinder: MapBinder<T>) => void): void;

    forEach<Q>(this: MapBinder<Q[]>, callbackfn: (value: ArrayBinder<Q>, key: string, mapBinder: MapBinder<T>) => void): void;
    forEach<Q>(this: MapBinder<ObjectMap<Q>>, callbackfn: (value: MapBinder<Q>, key: string, mapBinder: MapBinder<T>) => void): void;
    forEach<Q extends Object>(this: MapBinder<Q>, callbackfn: (value: ObjectBinder<Q>, key: string, mapBinder: MapBinder<T>) => void): void;
    forEach(callbackfn: (value: Binder<T>, key: string, mapBinder: MapBinder<T>) => void): void;
}

export type UpdateBinder<T> =       (newRootBinder: Binder<T>,       newBinder: Binder<any>, oldBinder: Binder<any>) => void
export type UpdateArrayBinder<T> =  (newRootBinder: ArrayBinder<T>,  newBinder: Binder<any>, oldBinder: Binder<any>) => void
export type UpdateObjectBinder<T> = (newRootBinder: ObjectBinder<T>, newBinder: Binder<any>, oldBinder: Binder<any>) => void
export type UpdateMapBinder<T> =    (newRootBinder: MapBinder<T>,    newBinder: Binder<any>, oldBinder: Binder<any>) => void

export type InitializeValueBinder = (newValue: any, oldBinder: Binder<any>) => any

export declare function createBinder(value: boolean, update?: UpdateBinder<boolean>, initialize?: InitializeValueBinder): Binder<boolean>;
export declare function createBinder(value: number,  update?: UpdateBinder<number>,  initialize?: InitializeValueBinder): Binder<number>;
export declare function createBinder(value: string,  update?: UpdateBinder<string>,  initialize?: InitializeValueBinder): Binder<string>;
export declare function createBinder(value: Date,    update?: UpdateBinder<Date>,    initialize?: InitializeValueBinder): Binder<Date>;

export declare function createBinder<T>(value: T[],  update?: UpdateArrayBinder<T>,  initialize?: InitializeValueBinder): ArrayBinder<T>;
export declare function createBinder<T>(value: ObjectMap<T>, update?: UpdateMapBinder<T>, initialize?: InitializeValueBinder): MapBinder<T>;
export declare function createBinder<T extends Object>(value: T, update?: UpdateObjectBinder<T>, initialize?: InitializeValueBinder): ObjectBinder<T>;

export declare function createBinder<T>(value: T, update?: UpdateBinder<T>, initialize?: InitializeValueBinder): Binder<T>;

export interface DerivedBinderFrom {
    sourceBinder: Binder<any>
    createDerivedBinder: (sourceBinder: Binder<any>) => Binder<any>
    setSourceValue: (sourceBinder: Binder<any>, newDerivedBinder: Binder<any>) => Binder<any>
    derivationName: string
}

export declare function deriveBinderFrom<SOURCE, DERIVED>(
    sourceBinder: Binder<SOURCE>,
    createDerivedBinder: (sourceBinder: Binder<SOURCE>) => Binder<DERIVED>,
    setSourceValue: (sourceBinder: Binder<SOURCE>, newDerivedBinder: Binder<DERIVED>) => Binder<SOURCE>,
    derivationName: string
): Binder<DERIVED>

export declare function notBinder(source: Binder<boolean>): Binder<boolean>
export declare var inheritedExtras: string[]