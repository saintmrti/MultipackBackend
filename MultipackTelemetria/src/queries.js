module.exports.getMaxIdFrame = async (conn) => {
  const { data: multipack_minutes } = await conn.query(`
      SELECT * FROM vki40_Multipack_telemetria
      WHERE id= (SELECT MAX(id) FROM vki40_Multipack_telemetria);
      `);

  const { data: multipack_hours } = await conn.query(`
      SELECT * FROM vki40_Multipack_telemetria_horas
      WHERE id= (SELECT MAX(id) FROM vki40_Multipack_telemetria_horas);
      `);

  const { data: multipack_days } = await conn.query(`
      SELECT * FROM vki40_Multipack_telemetria_dias
      WHERE id= (SELECT MAX(id) FROM vki40_Multipack_telemetria_dias);
      `);

  return {
    multipack_minutes,
    multipack_hours,
    multipack_days,
  };
};

module.exports.getSummaryByHours = async (conn, start_date, end_date) => {
  const { data } = await conn.query(`
      SELECT * FROM vki40_Multipack_telemetria
      WHERE f_insercion >= '${start_date}' AND f_insercion <= '${end_date}';
    `);

  return data;
};

module.exports.insertRulaHours = async (
  conn,
  {
    max_idFrame,
    fecha,
    heartBeat,
    stepsDaily,
    stress,
    bodyBattery,
    pulse,
    breath,
  }
) => {
  await conn.query(`
    INSERT INTO vki40_Multipack_telemetria_horas (fecha, max_idFrame, idPulsera, heartBeat, stepsDaily, stress, bodyBattery, pulse, breath)
    VALUES ('${fecha}', ${max_idFrame}, 1, ${heartBeat}, ${stepsDaily}, ${stress}, ${bodyBattery}, ${pulse}, ${breath});
    `);
};

module.exports.getSummaryByDays = async (conn, start_date, end_date) => {
  const { data } = await conn.query(`
    SELECT * FROM vki40_Multipack_telemetria_horas
    WHERE fecha >= '${start_date}' AND fecha <= '${end_date}';
    `);
  return data;
};

module.exports.insertRulaDays = async (
  conn,
  {
    max_idFrame,
    fecha,
    heartBeat,
    stepsDaily,
    stress,
    bodyBattery,
    pulse,
    breath,
  }
) => {
  await conn.query(`
    INSERT INTO vki40_Multipack_telemetria_dias (fecha, max_idFrame, idPulsera, heartBeat, stepsDaily, stress, bodyBattery, pulse, breath)
    VALUES ('${fecha}', ${max_idFrame}, 1, ${heartBeat}, ${stepsDaily}, ${stress}, ${bodyBattery}, ${pulse}, ${breath});
    `);
};

module.exports.updateRulaDays = async (
  conn,
  { id, heartBeat, stepsDaily, stress, bodyBattery, pulse, breath }
) => {
  await conn.query(`
    UPDATE vki40_Multipack_telemetria_dias
    SET heartBeat = ${heartBeat}, stepsDaily = ${stepsDaily}, stress = ${stress}, bodyBattery = ${bodyBattery}, pulse = ${pulse}, breath = ${breath}
    WHERE id = ${id};
    `);
};
