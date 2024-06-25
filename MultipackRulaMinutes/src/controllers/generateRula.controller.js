const _ = require("lodash");

const { calculateScore } = require("./calculateScore.controller");

module.exports.generateRula = (arrayOverall) => {
  try {
    const interval = 5;
    let arrayRula = [];

    const groups = _.chain(arrayOverall)
      .groupBy((item) => {
        const date = new Date(item.f_insercion);
        const roundedDate = new Date(
          Math.floor(date.getTime() / (interval * 60 * 1000)) *
            interval *
            60 *
            1000
        );
        return roundedDate.toString();
      })
      .map((items, key) => ({
        fecha: new Date(key),
        skeletons: _.map(items, "c_jsonSkeleton"),
      }))
      .value();

    for (let i = 0; i < groups.length; i++) {
      const { fecha, skeletons } = groups[i];
      const rula = calculateRula(skeletons);
      if (Object.values(rula).every((val) => val === "NULL")) {
        console.log("El objeto tiene todos los valores como NULL");
      } else {
        const obj = { fecha, ...rula };
        arrayRula.push(obj);
      }
    }
    // let arrayRula = [];

    // const groups = _.map(arrayOverall, (item) => {
    //   const parseSkeletons = JSON.parse(item.skeletons);
    //   return {
    //     fecha: item.fecha,
    //     skeletons: parseSkeletons,
    //   };
    // });

    // for (let i = 0; i < groups.length; i++) {
    //   const { fecha, skeletons } = groups[i];
    //   const rula = calculateRula(skeletons);
    //   if (Object.values(rula).every((val) => val === "NULL")) {
    //     console.log("El objeto tiene todos los valores como NULL");
    //   } else {
    //     const obj = { fecha, ...rula };
    //     arrayRula.push(obj);
    //   }
    // }

    // console.log(arrayRula);

    arrayRula = arrayRula.filter(
      (item) =>
        !isNaN(parseFloat(item.scoreLeft)) &&
        !isNaN(parseFloat(item.scoreRight))
    );
    const rulaLeft = parseFloat(_.meanBy(arrayRula, "scoreLeft").toFixed(2));
    const rulaRight = parseFloat(_.meanBy(arrayRula, "scoreRight").toFixed(2));
    const maxRula = _.max([rulaLeft, rulaRight]);
    const orderByDate = _.sortBy(arrayRula, "fecha");
    const dataRula = JSON.stringify(orderByDate);

    const rulaGral = maxRula !== undefined ? maxRula : 0;

    return {
      dataRula,
      rulaGral,
    };
  } catch (error) {
    console.log(error);
  }
};

function calculateRula(skeletons) {
  try {
    // let arrayBodyParts = [];

    // for (let i = 0; i < skeletons.length; i++) {
    //   const { articulaciones, operando } = skeletons[i];
    //   const bodyObj = {};
    //   if (operando == true) {
    //     for (let k = 0; k < articulaciones.length; k++) {
    //       const { idParteCuerpo, puntoX, puntoY, puntoZ } = articulaciones[k];
    //       bodyObj[`idCuerpo${idParteCuerpo}`] = {
    //         puntoX,
    //         puntoY,
    //         puntoZ: puntoZ / 3500,
    //       };
    //     }
    //     arrayBodyParts.push(bodyObj);
    //   }
    // }

    let arrayBodyParts = [];
    let arraySkeletons = [];

    for (let i = 0; i < skeletons.length; i++) {
      const json = JSON.parse(skeletons[i]);
      arraySkeletons.push(json);
      for (let j = 0; j < arraySkeletons[i].length; j++) {
        const { articulaciones, operando } = arraySkeletons[i][j];
        const bodyObj = {};
        if (operando == true) {
          for (let k = 0; k < articulaciones.length; k++) {
            const { idParteCuerpo, puntoX, puntoY, puntoZ } = articulaciones[k];
            bodyObj[`idCuerpo${idParteCuerpo}`] = {
              puntoX,
              puntoY,
              puntoZ: puntoZ / 3500,
            };
          }
          arrayBodyParts.push(bodyObj);
        }
      }
    }

    let arrayUpperArmLeft = [];
    let arrayUpperArmRight = [];
    let arrayLowerArmLeft = [];
    let arrayLowerArmRight = [];
    let arrayTrunk = [];
    let arrayNeck = [];
    let arrayScore = [];

    let upperArmLeft;
    let upperArmRight;
    let lowerArmLeft;
    let lowerArmRight;
    let neckMean;
    let trunkMean;
    let rula;

    _.forEach(arrayBodyParts, (artic) => {
      upperArmLeft = groupAUpperArmLeft(artic);
      upperArmRight = groupAUpperArmRight(artic);
      lowerArmLeft = groupALowerArmLeft(artic);
      lowerArmRight = groupALowerArmRight(artic);
      neckMean = groupBNeck(artic);
      trunkMean = groupBTrunk(artic);
      rula = calculateScore(
        upperArmLeft,
        upperArmRight,
        lowerArmLeft,
        lowerArmRight,
        neckMean,
        trunkMean
      );

      arrayScore.push(rula);
      arrayUpperArmLeft.push(upperArmLeft);
      arrayUpperArmRight.push(upperArmRight);
      arrayLowerArmLeft.push(lowerArmLeft);
      arrayLowerArmRight.push(lowerArmRight);
      arrayNeck.push(neckMean);
      arrayTrunk.push(trunkMean);
    });

    let upArmLeft = _.mean(arrayUpperArmLeft);
    let upArmRight = _.mean(arrayUpperArmRight);
    let lowArmLeft = _.mean(arrayLowerArmLeft);
    let lowArmRight = _.mean(arrayLowerArmRight);
    let neck = _.mean(arrayNeck);
    let trunk = _.mean(arrayTrunk);
    let scoreLeft = _.meanBy(arrayScore, "scoreLeftC");
    let scoreRight = _.meanBy(arrayScore, "scoreRightC");

    upArmLeft = !isNaN(upArmLeft)
      ? parseFloat(upArmLeft.toFixed(4))
      : (upArmLeft = "NULL");
    upArmRight = !isNaN(upArmRight)
      ? parseFloat(upArmRight.toFixed(4))
      : (upArmRight = "NULL");
    lowArmLeft = !isNaN(lowArmLeft)
      ? parseFloat(lowArmLeft.toFixed(4))
      : (lowArmLeft = "NULL");
    lowArmRight = !isNaN(lowArmRight)
      ? parseFloat(lowArmRight.toFixed(4))
      : (lowArmRight = "NULL");
    neck = !isNaN(neck) ? parseFloat(neck.toFixed(4)) : (neck = "NULL");
    trunk = !isNaN(trunk) ? parseFloat(trunk.toFixed(4)) : (trunk = "NULL");
    scoreLeft = !isNaN(scoreLeft)
      ? parseFloat(scoreLeft.toFixed(4))
      : (scoreLeft = "NULL");
    scoreRight = !isNaN(scoreRight)
      ? parseFloat(scoreRight.toFixed(4))
      : (scoreRight = "NULL");

    // console.log(arrayScore);
    const obj = {
      upArmLeft,
      upArmRight,
      lowArmLeft,
      lowArmRight,
      neck,
      trunk,
      scoreLeft,
      scoreRight,
    };

    return obj;
  } catch (error) {
    console.log(error);
  }
}

function getAngle(x, y) {
  let rad = Math.atan2(x, y);
  return (rad * 180) / Math.PI;
}

function getAngleUp(artic, id1, id2) {
  const puntoY1 = artic[id1].puntoY;
  const puntoY2 = artic[id2].puntoY;

  const y2_y1 = puntoY2 - puntoY1;

  const puntoZ2 = artic[id1].puntoZ;
  const puntoZ1 = artic[id2].puntoZ;

  const z2_z1 = puntoZ2 - puntoZ1;

  let rad = Math.atan(z2_z1 / y2_y1);

  if (rad !== 0) {
    let angle = (rad * 180) / Math.PI + 90;
    return Math.abs(angle);
  } else {
    return 0;
  }
}

function getAngleDown(artic, id1, id2) {
  const puntoY1 = artic[id1].puntoY;
  const puntoY2 = artic[id2].puntoY;

  const y2_y1 = puntoY2 - puntoY1;

  const puntoZ2 = artic[id1].puntoZ;
  const puntoZ1 = artic[id2].puntoZ;

  const z2_z1 = puntoZ2 - puntoZ1;

  let rad = Math.atan(y2_y1 / z2_z1);

  if (rad !== 0) {
    let angle = (rad * 180) / Math.PI;
    return angle;
  } else {
    return 0;
  }
}

function getAbdu(artic, id1, id2) {
  const puntoY1 = artic[id1].puntoY;
  const puntoY2 = artic[id2].puntoY;

  const y2_y1 = Math.abs(puntoY2 - puntoY1);

  const puntoX1 = artic[id1].puntoX;
  const puntoX2 = artic[id2].puntoX;

  const x2_x1 = Math.abs(puntoX2 - puntoX1);

  let rad = Math.atan2(x2_x1, y2_y1);
  let angle = (rad * 180) / Math.PI;
  return angle;
}

function groupAUpperArmLeft(artic) {
  const angle = getAngleUp(artic, "idCuerpo8", "idCuerpo7");
  const abdu = getAbdu(artic, "idCuerpo7", "idCuerpo8");
  const shoulElev = artic["idCuerpo7"].puntoY - artic["idCuerpo6"].puntoY;

  let valor1 =
    angle >= -20 && angle < 20
      ? 1
      : angle >= 20 && angle < 45
      ? 2
      : angle >= 45 && angle < 90
      ? 3
      : angle >= 90
      ? 4
      : 0;
  let valor2 = shoulElev < 0 ? 1 : 0;
  let valor3 = abdu >= 45 ? 1 : 0;

  return valor1 + valor2 + valor3;
}

function groupAUpperArmRight(artic) {
  const angle = getAngleUp(artic, "idCuerpo14", "idCuerpo13");
  const abdu = getAbdu(artic, "idCuerpo13", "idCuerpo14");
  const shoulElev = artic["idCuerpo13"].puntoY - artic["idCuerpo12"].puntoY;

  let valor1 =
    angle >= -20 && angle < 20
      ? 1
      : angle >= 20 && angle < 45
      ? 2
      : angle >= 45 && angle < 90
      ? 3
      : angle >= 90
      ? 4
      : 0;
  let valor2 = shoulElev < 0 ? 1 : 0;
  let valor3 = abdu >= 45 ? 1 : 0;

  return valor1 + valor2 + valor3;
}

function groupALowerArmLeft(artic) {
  const angle = getAngleDown(artic, "idCuerpo9", "idCuerpo8");
  const value1 = artic["idCuerpo4"].puntoX - artic["idCuerpo10"].puntoX;
  const value2 = artic["idCuerpo4"].puntoX - artic["idCuerpo7"].puntoX;

  let resultado1 = 0;
  if (angle <= 90 && angle >= -10) {
    resultado1 = 1;
  } else if (angle < -10) {
    resultado1 = 2;
  }

  let resultado2 = 0;
  if (value1 < 0 && value2 < 0) {
    resultado2 = 1;
  } else if (value1 > 0 && value2 > 0) {
    resultado2 = 1;
  } else if (value1 > 0 && value2 < 0) {
    resultado2 = 0;
  } else if (value1 < 0 && value2 > 0) {
    resultado2 = 0;
  }

  return resultado1 + resultado2;
}

function groupALowerArmRight(artic) {
  const angle = getAngleDown(artic, "idCuerpo15", "idCuerpo14");
  const value1 = artic["idCuerpo4"].puntoX - artic["idCuerpo16"].puntoX;
  const value2 = artic["idCuerpo4"].puntoX - artic["idCuerpo13"].puntoX;

  let resultado1 = 0;
  if (angle <= 90 && angle >= -10) {
    resultado1 = 1;
  } else if (angle < -10) {
    resultado1 = 2;
  }

  let resultado2 = 0;
  if (value1 < 0 && value2 < 0) {
    resultado2 = 1;
  } else if (value1 > 0 && value2 > 0) {
    resultado2 = 1;
  } else if (value1 > 0 && value2 < 0) {
    resultado2 = 0;
  } else if (value1 < 0 && value2 > 0) {
    resultado2 = 0;
  }

  return resultado1 + resultado2;
}

function groupBNeck(artic) {
  const puntoX1 = artic["idCuerpo6"].puntoX;
  const puntoX2 = artic["idCuerpo2"].puntoX;

  const x2_x1 = Math.abs(puntoX2 - puntoX1);

  const puntoY1 = artic["idCuerpo6"].puntoY;
  const puntoY2 = artic["idCuerpo2"].puntoY;

  const y2_y1 = Math.abs(puntoY2 - puntoY1);

  const puntoZ1 = artic["idCuerpo6"].puntoZ;
  const puntoZ2 = artic["idCuerpo2"].puntoZ;

  const z2_z1 = Math.abs(puntoZ2 - puntoZ1);

  const angle1 = getAngle(z2_z1, y2_y1);
  const angle2 = getAngle(x2_x1, y2_y1);

  let valor1 =
    angle1 >= 0 && angle1 < 10
      ? 1
      : angle1 >= 10 && angle1 < 20
      ? 2
      : angle1 >= 20
      ? 3
      : angle1 > 90
      ? 2
      : 2;
  let valor2 = angle2 > 15 ? 1 : 0;

  return valor1 + valor2;
}

function groupBTrunk(artic) {
  const puntoX1 = artic["idCuerpo5"].puntoX;
  const puntoX2 = artic["idCuerpo6"].puntoX;

  const x2_x1 = Math.abs(puntoX2 - puntoX1);

  const puntoY1 = artic["idCuerpo5"].puntoY;
  const puntoY2 = artic["idCuerpo6"].puntoY;

  const y2_y1 = Math.abs(puntoY2 - puntoY1);

  const puntoZ1 = artic["idCuerpo5"].puntoZ;
  const puntoZ2 = artic["idCuerpo6"].puntoZ;

  const z2_z1 = Math.abs(puntoZ2 - puntoZ1);

  const angle1 = getAngle(z2_z1, y2_y1);
  const angle2 = getAngle(x2_x1, y2_y1);

  let valor1 =
    angle1 === 0
      ? 1
      : angle1 >= -20 && angle1 < 20
      ? 2
      : angle1 >= 20 && angle1 < 60
      ? 3
      : angle1 < 60
      ? 4
      : 0;
  let valor2 = angle2 > 15 ? 1 : 0;

  return valor1 + valor2;
}
