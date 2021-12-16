const doWorkCallback = (callback) => {
    setTimeout(() => {
        callback(undefined, [1, 2, 3])
    }, 2000)
}

doWorkCallback((error, result) => {
    if(error) {
        return console.log("Error Msg: " + error);
    }

    console.log("The result is: " + result);
})

// add function using callback
const addCallback = (a, b, callback) => {
    setTimeout(() => {
        if(a < 0 || b < 0) {
            callback("Error The numbers should be positive")
        } else {
            callback(undefined, a + b)
        }
    }, 2000)
}

addCallback(1, 5, (error, result) => {
    if(error) {
        return console.log(error);
    }

    console.log(result);
})