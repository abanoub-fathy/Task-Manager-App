const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0) {
                reject(`There is negtive integers[s] in your inputs ${a}, ${b}`)
            }
    
            resolve(a + b)
        }, 2000);

    })
}

// without promise chaining syntax
// add(1, 2).then(sum => {
//     console.log(sum)

//     add(sum, 9).then(sum2 => {
//         console.log(sum2)
//     }).catch(e => {
//         console.log(e)
//     })

// }).catch(e => {
//     console.log(e)
// })

// using promise chaining syntax
add(1, 2).then(sum => {
    console.log(sum)
    return add(sum, 9)
}).then(sum2 => {
    console.log(sum2);
}).catch(e => {
    console.log(e);
})
