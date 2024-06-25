const { telemetriaHoursHandler, telemetriaDaysHandler } = require("./src/app");

module.exports = async function (context) {
  try {
    await telemetriaHoursHandler(context);
    await telemetriaDaysHandler(context);
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
//     await telemetriaDaysHandler(context);
//   } catch (error) {
//     console.log("******************** MAIN ERROR ********************");
//     console.log(error);
//   }
// };
// test();
