/**
 * Created by sheng.wang on 2017/11/29.
 */

export function isPropertyValueTrue(propVal) {
    return propVal === true || propVal === "true";
}

export function isPropertyValueFalse(propVal) {
    return propVal === false || propVal === "false";
}

export function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function rotate(array) {
    const ii = Math.floor(Math.random() * array.length * 2);
    for(let i = 0; i < ii; i++) {
        array.push(array.shift());
    }
}

export function extractHTMLElementAttributesFromProps(props){
    const pageDivProps = {};
    Object.entries(props).forEach(kv => {
        const [key, value] = kv;
        //if value is string or number, we copy it pageDivProps, we then later copy the pageDivProps to div tag.
        if (typeof value === "string" || typeof value === "number") {
            pageDivProps["data-"+key] = value;
        }
    });
    return pageDivProps;
}