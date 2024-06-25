const rulaMinutesHandler = require("./src/app");

module.exports = async function (context) {
  try {
    await rulaMinutesHandler(context);
  } catch (error) {
    context.log("******************** MAIN ERROR ********************");
    context.log(error);
  }
};

// const context = {
//   log: (...items) => console.log(...items),
// };

// const test = async function () {
//   try {
//     await rulaMinutesHandler(context);
//   } catch (error) {
//     console.log("******************** MAIN ERROR ********************");
//     console.log(error);
//   }
// };
// test();
// setInterval(() => {
//   test();
// }, 600000);
