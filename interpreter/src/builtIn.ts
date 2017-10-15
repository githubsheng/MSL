export class List {
    private _elements: Array<any>;
    constructor(elements){
        this._elements = elements;
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
        this._elements.unshift(list._elements);
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
        this._elements.shift();
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

    randomize() {
        //for each element in the list, swap its position with another random element.
        for(let i = 0; i < this._elements.length; i++) {
            const t1 = this._elements[i];
            const t2i = _getRandomNumber(0, this._elements.length);
            const t2 = this._elements[t2i];
            this._elements[i] = t2;
            this._elements[t2i] = t1;
        }
    }

    rotate() {
        let r = _getRandomNumber(0, this._elements.length);
        while(r > 0) {
            let h = this._elements.shift();
            this._elements.push(h);
            r--;
        }
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

export function _list(...elements) {
    return new List(elements);
}

export function _clock(): number {
    const now = new Date();
    return now.getHours();
}