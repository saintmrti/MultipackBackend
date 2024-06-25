module.exports.calculateScore = (
  upperArmLeft,
  upperArmRight,
  lowerArmLeft,
  lowerArmRight,
  neck,
  trunk
) => {
  try {
    class tablaA {
      constructor(upperArm, lowerArm, score) {
        this.upperArm = upperArm;
        this.lowerArm = lowerArm;
        this.score = score;
      }
    }

    const list = [];

    list.push(new tablaA(1, 1, 1));
    list.push(new tablaA(1, 2, 2));
    list.push(new tablaA(1, 3, 2));
    list.push(new tablaA(2, 1, 2));
    list.push(new tablaA(2, 2, 3));
    list.push(new tablaA(2, 3, 3));
    list.push(new tablaA(3, 1, 3));
    list.push(new tablaA(3, 2, 3));
    list.push(new tablaA(3, 3, 4));
    list.push(new tablaA(4, 1, 4));
    list.push(new tablaA(4, 2, 4));
    list.push(new tablaA(4, 3, 4));
    list.push(new tablaA(5, 1, 5));
    list.push(new tablaA(5, 2, 5));
    list.push(new tablaA(5, 3, 6));
    list.push(new tablaA(6, 1, 7));
    list.push(new tablaA(6, 2, 8));
    list.push(new tablaA(6, 3, 9));

    if (
      upperArmLeft < 6 ||
      upperArmRight < 6 ||
      lowerArmLeft < 3 ||
      lowerArmRight < 3
    ) {
      const scoreLeftA = list.find(
        (x) => x.upperArm === upperArmLeft && x.lowerArm === lowerArmLeft
      ).score;
      const scoreRightA = list.find(
        (x) => x.upperArm === upperArmRight && x.lowerArm === lowerArmRight
      ).score;

      class tablaB {
        constructor(cuello, torso, score) {
          this.cuello = cuello;
          this.torso = torso;
          this.score = score;
        }
      }

      const list2 = [];

      list2.push(new tablaB(1, 1, 1));
      list2.push(new tablaB(1, 2, 2));
      list2.push(new tablaB(1, 3, 3));
      list2.push(new tablaB(1, 4, 5));
      list2.push(new tablaB(1, 5, 6));
      list2.push(new tablaB(1, 6, 7));

      list2.push(new tablaB(2, 1, 2));
      list2.push(new tablaB(2, 2, 2));
      list2.push(new tablaB(2, 3, 4));
      list2.push(new tablaB(2, 4, 5));
      list2.push(new tablaB(2, 5, 6));
      list2.push(new tablaB(2, 6, 7));

      list2.push(new tablaB(3, 1, 3));
      list2.push(new tablaB(3, 2, 3));
      list2.push(new tablaB(3, 3, 4));
      list2.push(new tablaB(3, 4, 5));
      list2.push(new tablaB(3, 5, 6));
      list2.push(new tablaB(3, 6, 7));

      list2.push(new tablaB(4, 1, 5));
      list2.push(new tablaB(4, 2, 5));
      list2.push(new tablaB(4, 3, 6));
      list2.push(new tablaB(4, 4, 7));
      list2.push(new tablaB(4, 5, 7));
      list2.push(new tablaB(4, 6, 8));

      list2.push(new tablaB(5, 1, 7));
      list2.push(new tablaB(5, 2, 7));
      list2.push(new tablaB(5, 3, 7));
      list2.push(new tablaB(5, 4, 8));
      list2.push(new tablaB(5, 5, 8));
      list2.push(new tablaB(5, 6, 8));

      list2.push(new tablaB(6, 1, 8));
      list2.push(new tablaB(6, 2, 8));
      list2.push(new tablaB(6, 3, 8));
      list2.push(new tablaB(6, 4, 8));
      list2.push(new tablaB(6, 5, 9));
      list2.push(new tablaB(6, 6, 9));

      const scoreB = list2.find(
        (x) => x.cuello === neck && x.torso === trunk
      ).score;

      class tablaC {
        constructor(puntuacionC, puntuacionD, score) {
          this.puntuacionC = puntuacionC;
          this.puntuacionD = puntuacionD;
          this.score = score;
        }
      }

      const list3 = [];

      list3.push(new tablaC(1, 1, 1));
      list3.push(new tablaC(1, 2, 2));
      list3.push(new tablaC(1, 3, 3));
      list3.push(new tablaC(1, 4, 3));
      list3.push(new tablaC(1, 5, 4));
      list3.push(new tablaC(1, 6, 5));
      list3.push(new tablaC(1, 7, 5));

      list3.push(new tablaC(2, 1, 2));
      list3.push(new tablaC(2, 2, 2));
      list3.push(new tablaC(2, 3, 3));
      list3.push(new tablaC(2, 4, 4));
      list3.push(new tablaC(2, 5, 4));
      list3.push(new tablaC(2, 6, 5));
      list3.push(new tablaC(2, 7, 5));

      list3.push(new tablaC(3, 1, 3));
      list3.push(new tablaC(3, 2, 3));
      list3.push(new tablaC(3, 3, 3));
      list3.push(new tablaC(3, 4, 4));
      list3.push(new tablaC(3, 5, 4));
      list3.push(new tablaC(3, 6, 5));
      list3.push(new tablaC(3, 7, 6));

      list3.push(new tablaC(4, 1, 3));
      list3.push(new tablaC(4, 2, 3));
      list3.push(new tablaC(4, 3, 3));
      list3.push(new tablaC(4, 4, 4));
      list3.push(new tablaC(4, 5, 5));
      list3.push(new tablaC(4, 6, 6));
      list3.push(new tablaC(4, 7, 6));

      list3.push(new tablaC(5, 1, 4));
      list3.push(new tablaC(5, 2, 4));
      list3.push(new tablaC(5, 3, 4));
      list3.push(new tablaC(5, 4, 5));
      list3.push(new tablaC(5, 5, 6));
      list3.push(new tablaC(5, 6, 7));
      list3.push(new tablaC(5, 7, 7));

      list3.push(new tablaC(6, 1, 4));
      list3.push(new tablaC(6, 2, 4));
      list3.push(new tablaC(6, 3, 5));
      list3.push(new tablaC(6, 4, 6));
      list3.push(new tablaC(6, 5, 6));
      list3.push(new tablaC(6, 6, 7));
      list3.push(new tablaC(6, 7, 7));

      list3.push(new tablaC(7, 1, 5));
      list3.push(new tablaC(7, 2, 5));
      list3.push(new tablaC(7, 3, 6));
      list3.push(new tablaC(7, 4, 6));
      list3.push(new tablaC(7, 5, 7));
      list3.push(new tablaC(7, 6, 7));
      list3.push(new tablaC(7, 7, 7));

      list3.push(new tablaC(8, 1, 5));
      list3.push(new tablaC(8, 2, 5));
      list3.push(new tablaC(8, 3, 6));
      list3.push(new tablaC(8, 4, 7));
      list3.push(new tablaC(8, 5, 7));
      list3.push(new tablaC(8, 6, 7));
      list3.push(new tablaC(8, 7, 7));

      if (scoreLeftA < 9 && scoreRightA < 9) {
        const scoreC = scoreB > 7 ? 7 : scoreB;
        const scoreLeftC = list3.find(
          (x) => x.puntuacionC === scoreLeftA && x.puntuacionD === scoreC
        ).score;
        const scoreRightC = list3.find(
          (x) => x.puntuacionC === scoreRightA && x.puntuacionD === scoreC
        ).score;
        return { scoreLeftC, scoreRightC };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
