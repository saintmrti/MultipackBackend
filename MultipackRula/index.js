const { rulaHoursHandler } = require("./src/app");
const { rulaDaysHandler } = require("./src/app");

module.exports = async function (context) {
  try {
    await rulaHoursHandler(context);
    await rulaDaysHandler(context);
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
//     await rulaHoursHandler(context);
//   } catch (error) {
//     console.log("******************** MAIN ERROR ********************");
//     console.log(error);
//   }
// };
// test();
// setInterval(() => {
//   test();
// }, 3600000);
