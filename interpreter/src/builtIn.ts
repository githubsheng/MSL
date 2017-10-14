export class List {
    private _elements: Array<any>;
    constructor(){
        this._elements = [];
    }

    get(index: number){
        return this._elements[index];
    }

    //todo: in the future we may not use 0 and 1 for booleans
    has(el): number {
        const t = this._elements.indexOf(el);
        return t === -1? 0 : 1;
    }

    indexOf(el): number {
        return this._elements.indexOf(el);
    }

    add(el) {
        this._elements.push(el);
    }

    addFirst(el) {
        this._elements.splice(0, 0, el);
    }

    addLast(el) {
        this.add(el);
    }

    addAllFirst(list:List) {
        this._elements.splice(0, 0, ...list._elements);
    }

    addAllLast(list:List) {
        const s = this._elements.length;
        this._elements.splice(s, 0, ...list._elements);
    }

    set(index: number, el) {
        this._elements[index] = el;
    }

    addAt(index: number, el) {
        this._elements.splice(index, 0, el);
    }

    removeFirst(){
        this._elements.splice(0, 1);
    }

    removeLast(){
        this._elements.pop();
    }

    remove(el) {
        const i = this._elements.indexOf(el);
        if(i !== -1) this._elements.splice(i, 1);
    }

    removeAt(index: number) {
        this._elements.splice(index, 1)
    }

    clear(){
        this._elements = [];
    }

    get size(): number {
        return this._elements.length;
    }
}

export function _print(something) {
    console.log(something);
}

export function _getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function _list() {
    return new List();
}