const doWorkPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("You have no access!")
        resolve([4, 5, 6])
    }, 2000)
})

doWorkPromise.then(result => {
    console.log(result)
}).catch((error) => {
    console.log(error);
})

// add function using promises
const addPromises = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0) {
                reject("-ive Error")
            } else {
                resolve(a + b);
            }
        }, 3000)
    })
}

addPromises(5, 4).then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
})