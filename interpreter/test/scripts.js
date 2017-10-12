function sendFunc(data, returnAnswerCallback) {
    console.log(data);
    returnAnswerCallback(null);
}

function run(){
    const commandsStr = document.querySelector("#commands").value;
    const stringConstStr = document.querySelector("#string-constants").value;
    const interpreter = new Interpreter(commandsStr, stringConstStr, sendFunc);
    interpreter.run();
}