module.exports.getMaxIdFrame = async (conn) => {
  // const { data: max_nuitrack } = await conn.query(`
  //     SELECT * FROM vki40_Variables_Multipack
  //     WHERE id= (SELECT MAX(id) FROM vki40_Variables_Multipack);
  //     `);

  const { data: multipack_minutes } = await conn.query(`
      SELECT * FROM vki40_Multipack_rula_minutos
      WHERE idRula= (SELECT MAX(idRula) FROM vki40_Multipack_rula_minutos);
      `);

  const { data: multipack_hours } = await conn.query(`
      SELECT * FROM vki40_Multipack_rula_horas
      WHERE idRula= (SELECT MAX(idRula) FROM vki40_Multipack_rula_horas);
      `);

  const { data: multipack_days } = await conn.query(`
      SELECT * FROM vki40_Multipack_rula_dias
      WHERE idRula= (SELECT MAX(idRula) FROM vki40_Multipack_rula_dias);
      `);

  return {
    // max_nuitrack,
    multipack_minutes,
    multipack_hours,
    multipack_days,
  };
};

module.exports.getSummaryByHours = async (conn, start_date, end_date) => {
  const { data } = await conn.query(`
    SELECT * FROM vki40_Multipack_rula_minutos
    WHERE fecha >= '${start_date}' AND fecha <= '${end_date}';
    `);

  return data;
};

module.exports.insertRulaHours = async (
  conn,
  { max_idFrame, fecha, rula, rulaGral, ticks }
) => {
  await conn.query(`
    INSERT INTO vki40_Multipack_rula_horas (fecha, max_idFrame, rula, rulaGral, ticks)
    VALUES ('${fecha}', ${max_idFrame}, '${rula}', ${rulaGral}, ${ticks});
    `);
};

module.exports.getSummaryByDays = async (conn, start_date, end_date) => {
  const { data } = await conn.query(`
    SELECT * FROM vki40_Multipack_rula_horas
    WHERE fecha >= '${start_date}' AND fecha <= '${end_date}';
    `);
  return data;
};

module.exports.insertRulaDays = async (
  conn,
  { max_idFrame, fecha, rula, rulaGral, ticks }
) => {
  await conn.query(`
    INSERT INTO vki40_Multipack_rula_dias (fecha, max_idFrame, rula, rulaGral, ticks)
    VALUES ('${fecha}', ${max_idFrame}, '${rula}', ${rulaGral}, ${ticks});
    `);
};

module.exports.updateRulaDays = async (
  conn,
  { idRula, rula, rulaGral, ticks, fecha, max_idFrame }
) => {
  await conn.query(`
    UPDATE vki40_Multipack_rula_dias
    SET rula='${rula}', rulaGral=${rulaGral}, ticks=${ticks}, fecha='${fecha}', max_idFrame=${max_idFrame}
    WHERE idRula=${idRula};
    `);
};
