const moment = require("moment-timezone");

const Connection = require("../../src/connection");
const { requestEndpoints } = require("./oauth/requestEndpoints");
const { postData } = require("./queries");

module.exports.telemetryController = async (res, req) => {
  try {
    const cn = new Connection(false);
    const dateNow = moment().tz("America/Mexico_City");
    const dateWeek = dateNow.subtract(7, "days");

    dateWeek.set({
      hour: 23,
      minute: 59,
      second: 0,
      millisecond: 0,
    });

    let endTime = dateWeek.unix();

    let startTime = endTime - 86340;

    let timestamp = `uploadStartTimeInSeconds=${startTime}&uploadEndTimeInSeconds=${endTime}`;

    let currentDate = moment().unix();

    while (endTime < currentDate) {
      // console.log(timestamp);
      const merge = await requestEndpoints(timestamp);
      if (typeof merge !== null && typeof merge !== "undefined") {
        await postData(cn, merge);
      }
      startTime = endTime + 60;
      endTime = endTime + 86400;
      timestamp = `uploadStartTimeInSeconds=${startTime}&uploadEndTimeInSeconds=${endTime}`;
    }

    let endTime2 = currentDate - 60;
    startTime = endTime2 - 86400;
    timestamp = `uploadStartTimeInSeconds=${startTime}&uploadEndTimeInSeconds=${endTime2}`;
    // console.log(timestamp);
    const merge = await requestEndpoints(timestamp);
    if (typeof merge !== null && typeof merge !== "undefined") {
      await postData(cn, merge);
    }
  } catch (error) {
    console.log(error);
  }
};
