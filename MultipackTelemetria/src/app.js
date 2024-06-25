const Connection = require("../../src/connection");
const moment = require("moment");
const _ = require("lodash");

const {
  getSummaryByHours,
  getMaxIdFrame,
  insertRulaHours,
  getSummaryByDays,
  insertRulaDays,
  updateRulaDays,
} = require("./queries");

const telemetriaHoursHandler = async (console) => {
  try {
    const cn = new Connection(false);
    const { multipack_minutes, multipack_hours } = await getMaxIdFrame(cn);
    if (multipack_minutes.length > 0 && multipack_hours.length > 0) {
      const start_date = moment(multipack_minutes[0].f_insercion)
        .startOf("hour")
        .subtract(1, "hour")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      const end_date = moment(multipack_minutes[0].f_insercion)
        .endOf("hour")
        .subtract(1, "hour")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      const last_date = moment(multipack_hours[0].fecha)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      // console.log({ start_date, end_date, last_date });
      if (last_date < end_date) {
        const arrayOverall = await getSummaryByHours(cn, start_date, end_date);
        if (arrayOverall.length > 0) {
          let heartBeatArray = [];
          let stepsDailyArray = [];
          let stressArray = [];
          let bodyBatteryArray = [];
          let pulseArray = [];
          let breathArray = [];
          _.forEach(arrayOverall, (item) => {
            if (item.n_heartBeat != null) heartBeatArray.push(item.n_heartBeat);
            if (item.n_stepsDaily != null)
              stepsDailyArray.push(item.n_stepsDaily);
            if (item.n_stress != null) stressArray.push(item.n_stress);
            if (item.n_bodyBattery != null)
              bodyBatteryArray.push(item.n_bodyBattery);
            if (item.n_pulse != null) pulseArray.push(item.n_pulse);
            if (item.n_breath != null) breathArray.push(item.n_breath);
          });
          const data = {
            max_idFrame: parseInt(multipack_minutes[0].id),
            fecha: end_date,
            heartBeat:
              heartBeatArray.length > 0
                ? parseInt(_.mean(heartBeatArray))
                : null,
            stepsDaily:
              stepsDailyArray.length > 0
                ? parseInt(_.mean(stepsDailyArray))
                : null,
            stress:
              stressArray.length > 0 ? parseInt(_.mean(stressArray)) : null,
            bodyBattery:
              bodyBatteryArray.length > 0
                ? parseInt(_.mean(bodyBatteryArray))
                : null,
            pulse: pulseArray.length > 0 ? parseInt(_.mean(pulseArray)) : null,
            breath:
              breathArray.length > 0
                ? parseFloat(_.mean(breathArray).toFixed(2))
                : null,
          };
          await insertRulaHours(cn, data);
          console.log({ status: "success" });
        }
      }
    }
    cn.close();
  } catch (e) {
    console.log(
      "******************** MULTIPAK HOURS ERROR ********************"
    );
    console.log(e);
  }
};

const telemetriaDaysHandler = async (console) => {
  try {
    const cn = new Connection(false);
    const { multipack_hours, multipack_days } = await getMaxIdFrame(cn);
    if (multipack_hours.length > 0 && multipack_days.length > 0) {
      const start_date = moment(multipack_hours[0].fecha)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const end_date = moment(multipack_hours[0].fecha)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const last_date = moment(multipack_days[0].fecha)
        .endOf("day")
        .format("YYYY-MM-DD");
      const today = moment(multipack_hours[0].fecha).format("YYYY-MM-DD");
      const arrayOverall = await getSummaryByDays(cn, start_date, end_date);
      if (arrayOverall.length > 0) {
        let heartBeatArray = [];
        let stepsDailyArray = [];
        let stressArray = [];
        let bodyBatteryArray = [];
        let pulseArray = [];
        let breathArray = [];
        _.forEach(arrayOverall, (item) => {
          if (item.heartBeat != null) heartBeatArray.push(item.heartBeat);
          if (item.stepsDaily != null) stepsDailyArray.push(item.stepsDaily);
          if (item.stress != null) stressArray.push(item.stress);
          if (item.bodyBattery != null) bodyBatteryArray.push(item.bodyBattery);
          if (item.pulse != null) pulseArray.push(item.pulse);
          if (item.breath != null) breathArray.push(item.breath);
        });
        const data = {
          id: parseInt(multipack_days[0].id),
          max_idFrame: parseInt(multipack_hours[0].max_idFrame),
          fecha: end_date,
          heartBeat:
            heartBeatArray.length > 0 ? parseInt(_.mean(heartBeatArray)) : null,
          stepsDaily:
            stepsDailyArray.length > 0
              ? parseInt(_.mean(stepsDailyArray))
              : null,
          stress: stressArray.length > 0 ? parseInt(_.mean(stressArray)) : null,
          bodyBattery:
            bodyBatteryArray.length > 0
              ? parseInt(_.mean(bodyBatteryArray))
              : null,
          pulse: pulseArray.length > 0 ? parseInt(_.mean(pulseArray)) : null,
          breath:
            breathArray.length > 0
              ? parseFloat(_.mean(breathArray).toFixed(2))
              : null,
        };
        if (last_date === today) {
          await updateRulaDays(cn, data);
          console.log({ status: "success update", data });
        } else {
          await insertRulaDays(cn, data);
          console.log({ status: "success insert", data });
        }
      }
    }
    cn.close();
  } catch (e) {
    console.log(
      "******************** MULTIPAK DAYS ERROR ********************"
    );
    console.log(e);
  }
};

module.exports.telemetriaHoursHandler = telemetriaHoursHandler;
module.exports.telemetriaDaysHandler = telemetriaDaysHandler;
