const _ = require("lodash");
const moment = require("moment-timezone");

const getLastDate = async (conn) => {
  try {
    const { data } = await conn.query(
      "SELECT MAX(f_insercion) as last_query_date FROM vki40_Multipack_telemetria"
    );
    // const lastQueryDate = result.recordset[0].last_query_date;
    return data[0].last_query_date;
  } catch (error) {
    console.log(error);
  }
};

module.exports.postData = async (conn, merge) => {
  try {
    const lastQueryDate = await getLastDate(conn);
    _.map(
      merge,
      async ({
        date,
        heartBeat,
        stepsDaily,
        stress,
        bodyBattery,
        pulse,
        breath,
      }) => {
        const registerDate = new Date(
          moment.tz(date, "UTC").tz("America/Mexico_City").format()
        );
        if (registerDate > lastQueryDate) {
          await conn.query(`
            INSERT INTO vki40_Multipack_telemetria(idPulsera, f_insercion,
                                                n_heartBeat, n_stepsDaily, n_stress, n_bodyBattery, n_pulse, n_breath)
            VALUES('1', '${date}',
                ${typeof heartBeat !== "undefined" ? heartBeat : "NULL"},
                ${typeof stepsDaily !== "undefined" ? stepsDaily : "NULL"},
                ${typeof stress !== "undefined" ? stress : "NULL"},
                ${typeof bodyBattery !== "undefined" ? bodyBattery : "NULL"},
                ${typeof pulse !== "undefined" ? pulse : "NULL"},
                ${typeof breath !== "undefined" ? breath : "NULL"}
            );
          `);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports.getLastDate = getLastDate;
