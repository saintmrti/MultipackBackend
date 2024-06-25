module.exports.getMaxIdFrame = async (conn) => {
  const { data: max_nuitrack } = await conn.query(`
      SELECT id, f_insercion, n_ticks FROM vki40_Variables_Multipack
      WHERE id= (SELECT MAX(id) FROM vki40_Variables_Multipack);
    `);

  const { data: multipack_minutes } = await conn.query(`
      SELECT * FROM vki40_Multipack_rula_minutos
      WHERE idRula= (SELECT MAX(idRula) FROM vki40_Multipack_rula_minutos);
      `);

  // const { data: Multipack_hours } = await conn.query(`
  //     SELECT * FROM vki40_Multipack_rula_horas
  //     WHERE idRula= (SELECT MAX(idRula) FROM vki40_Multipack_rula_horas);
  //     `);

  // const { data: Multipack_days } = await conn.query(`
  //     SELECT * FROM vki40_Multipack_rula_dias
  //     WHERE idRula= (SELECT MAX(idRula) FROM vki40_Multipack_rula_dias);
  //     `);

  return {
    max_nuitrack,
    multipack_minutes,
    // Multipack_hours,
    // Multipack_days,
  };
};

module.exports.getSummaryByMinutes = async (conn, last_date, min_date) => {
  const { data } = await conn.query(`
    SELECT f_insercion, c_jsonSkeleton FROM vki40_Variables_Multipack
    WHERE f_insercion between '${min_date}' AND '${last_date}';
      `);
  return data;
};

module.exports.insertRulaMinutes = async (
  conn,
  { max_idFrame, fecha, rula, rulaGral, ticks }
) => {
  await conn.query(`
      INSERT INTO vki40_Multipack_rula_minutos (fecha, max_idFrame, rula, rulaGral, ticks)
      VALUES ('${fecha}', ${max_idFrame}, '${rula}', ${rulaGral}, ${ticks});
      `);
};
