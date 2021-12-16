/*
 * Async function always returns a promise
 * to make this promise rejected use throw new Error()
 * await can only be used inside async function
 * you can await when dealing with a function returning promises
 ***/

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        reject(`numbers are negative with your inputs ${a}, ${b}`);
      }

      resolve(a + b);
    }, 2000);
  });
};

const doWork = async () => {
  const sum1 = await add(1, 99);
  const sum2 = await add(sum1, 50);
  const sum3 = await add(sum2, 8);
  return sum3;
};

doWork()
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
