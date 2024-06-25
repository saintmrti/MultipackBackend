const Connection = require("../../src/connection");
const moment = require("moment");

const {
  getSummaryByMinutes,
  getMaxIdFrame,
  insertRulaMinutes,
} = require("./queries");
const { generateRula } = require("./controllers/generateRula.controller");

const rulaMinutesHandler = async (console) => {
  try {
    const cn = new Connection(false);
    const { max_nuitrack, multipack_minutes } = await getMaxIdFrame(cn);
    // console.log({ max_nuitrack, multipack_minutes });
    if (max_nuitrack.length > 0 && multipack_minutes.length > 0) {
      if (
        parseInt(max_nuitrack[0].id) >
        parseInt(multipack_minutes[0].max_idFrame)
      ) {
        const last_date = moment(max_nuitrack[0].f_insercion)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss");
        const min_date = moment(last_date)
          .subtract(10, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
        const arrayOverall = await getSummaryByMinutes(cn, last_date, min_date);
        if (arrayOverall.length > 0) {
          const { dataRula, rulaGral } = generateRula(arrayOverall);
          const data = {
            max_idFrame: parseInt(max_nuitrack[0].id),
            fecha: last_date,
            rula: dataRula,
            rulaGral,
            ticks: parseInt(max_nuitrack[0].n_ticks),
          };
          await insertRulaMinutes(cn, data);
          console.log({ status: "success", data });
        }
      }
    }
    cn.close();
  } catch (e) {
    console.log(
      "******************** MULTIPAK MINUTES ERROR ********************"
    );
    console.log(e);
  }
};

module.exports = rulaMinutesHandler;
