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

const rulaHoursHandler = async (console) => {
  try {
    const cn = new Connection(false);
    const { multipack_minutes, multipack_hours } = await getMaxIdFrame(cn);
    if (multipack_minutes.length > 0 && multipack_hours.length > 0) {
      const start_date = moment(multipack_minutes[0].fecha)
        .startOf("hour")
        .subtract(1, "hour")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      const end_date = moment(multipack_minutes[0].fecha)
        .endOf("hour")
        .subtract(1, "hour")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      const last_date = moment(multipack_hours[0].fecha)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      console.log({ start_date, end_date, last_date });
      if (last_date < end_date) {
        const arrayOverall = await getSummaryByHours(cn, start_date, end_date);
        if (arrayOverall.length > 0) {
          const rulaGral = _.meanBy(arrayOverall, "rulaGral");
          const arrayRula = _.flatMap(arrayOverall, (item) => {
            const json = JSON.parse(item?.rula);
            return json;
          });
          const rula = _.uniqBy(arrayRula, "fecha");
          const data = {
            max_idFrame: parseInt(multipack_minutes[0].max_idFrame),
            ticks: parseInt(multipack_minutes[0].ticks),
            fecha: end_date,
            rulaGral,
            rula: JSON.stringify(rula),
          };
          await insertRulaHours(cn, data);
          console.log({ status: "success", data });
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

const rulaDaysHandler = async (console) => {
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
        const rulaGral = _.meanBy(arrayOverall, "rulaGral");
        const arrayRula = _.flatMap(arrayOverall, (item) => {
          const json = JSON.parse(item?.rula);
          return json;
        });
        const rula = _.uniqBy(arrayRula, "fecha");
        const data = {
          max_idFrame: parseInt(multipack_hours[0].max_idFrame),
          ticks: parseInt(multipack_hours[0].ticks),
          fecha: end_date,
          rulaGral,
          rula: JSON.stringify(rula),
          idRula: parseInt(multipack_days[0].idRula),
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

module.exports.rulaHoursHandler = rulaHoursHandler;
module.exports.rulaDaysHandler = rulaDaysHandler;
