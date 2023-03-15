// input cube size
let inputCubeSize = prompt("請輸入方塊邊長(建議50~250)");

let body = document.querySelector("body");
let root = document.querySelector(":root"); // html
let bodyWidth = body.offsetWidth;
let bodyHeight = body.offsetHeight;

// Cube color
let CubeOriginalColor = ["#FFFFFF", "#E9C1C1", "#F3DEDE"];
// color while hover
let color_template = ["#e2a4cd", "#ac3785", "#b6669b"];
root.style.setProperty("--TopCubeColor", CubeOriginalColor[0]);
root.style.setProperty("--LeftCubeColor", CubeOriginalColor[1]);
root.style.setProperty("--RightCubeColor", CubeOriginalColor[2]);

// 方塊邊長
// let unitCubeSize = 50;
let unitCubeSize = Number(inputCubeSize);
root.style.setProperty("--unitCubeSize", unitCubeSize + "px");

// 需要多少方塊填滿畫面
let CubeRequired = Math.ceil(bodyWidth / (2 * unitCubeSize)) + 1;
let rowRequired = Math.ceil(bodyHeight / (1.4 * unitCubeSize));
console.log(CubeRequired, rowRequired);

// 看是奇數還偶數row，用對應的 div.class 包起來
let whichRow = ["outter-even", "outter-odd"];
for (let cnt_i = 1; cnt_i <= rowRequired; cnt_i++) {
  nowRow = whichRow[cnt_i % 2];

  // 總共需要幾個方塊 (container)
  let temp_text = "";
  for (let cnt_j = 1; cnt_j <= CubeRequired; cnt_j++) {
    temp_text +=
      `<div class="container` +
      cnt_j +
      `">
    <div class="top"></div>
    <div class="left"></div>
    <div class="right"></div>
  </div>`;
  }

  // 根據是基數還偶數排，用outter-odd 或 outter-even包起來
  body.innerHTML += `<div class="${nowRow}">` + temp_text + `</div>`;
}

// 奇數排/偶數排 positioning
// odd rows and their cubes
let allOddRows = document.querySelectorAll("." + whichRow[1]);

allOddRows.forEach((row, row_idx) => {
  row.style.position = "absolute";
  row.style.top = 0 + row_idx * (unitCubeSize * (2 + 2 / Math.sqrt(3))) + "px";

  let allContainers = row.childNodes;
  allContainers.forEach((Cube, nthCube) => {
    Cube.style.position = "absolute";
    Cube.style.left = unitCubeSize * (1 + nthCube * 2) + "px";
  });
});

// even rows and their cubes
let allEvenRows = document.querySelectorAll("." + whichRow[0]);
allEvenRows.forEach((row, row_idx) => {
  row.style.position = "absolute";
  row.style.top =
    unitCubeSize * (1 + 1 / Math.sqrt(3)) +
    row_idx * (unitCubeSize * (2 + 2 / Math.sqrt(3))) +
    "px";
  row.style.left = 0;

  let allContainers = row.childNodes;
  allContainers.forEach((Cube, nthCube) => {
    Cube.style.position = "absolute";
    Cube.style.left = unitCubeSize * nthCube * 2 + "px";
  });
});

// All cubes' mouseover, mouseout event
let allRows = document.querySelectorAll(
  "." + whichRow[0] + "," + "." + whichRow[1]
);
allRows.forEach((row) => {
  let nowChild = row.childNodes;
  nowChild.forEach((Cube) => {
    Cube.style.transitionDuration = "3s";
    Cube.addEventListener("mouseover", () => {
      Cube.querySelectorAll("div").forEach((side, idx) => {
        side.style.transition = "0.2s";
      });
      for (
        let cnt_i = 0;
        cnt_i < Cube.querySelectorAll("div").length;
        cnt_i++
      ) {
        Cube.querySelectorAll("div")[cnt_i].style.background =
          color_template[cnt_i];
      }
    });

    Cube.addEventListener("mouseout", () => {
      Cube.querySelectorAll("div").forEach((side, idx) => {
        side.style.transition = "1s cubic-bezier(1.0, 0.1, 0.05, 0.01)";
      });
      for (
        let cnt_i = 0;
        cnt_i < Cube.querySelectorAll("div").length;
        cnt_i++
      ) {
        Cube.querySelectorAll("div")[cnt_i].style.background =
          CubeOriginalColor[cnt_i];
      }
    });

    // touch screen
    Cube.addEventListener("touchmove", () => {
      Cube.querySelectorAll("div").forEach((side, idx) => {
        side.style.transition = "0.2s";
      });
      for (
        let cnt_i = 0;
        cnt_i < Cube.querySelectorAll("div").length;
        cnt_i++
      ) {
        Cube.querySelectorAll("div")[cnt_i].style.background =
          color_template[cnt_i];
      }
    });
    Cube.addEventListener("touchend", () => {
      Cube.querySelectorAll("div").forEach((side, idx) => {
        side.style.transition = "1s cubic-bezier(1.0, 0.1, 0.05, 0.01)";
      });
      for (
        let cnt_i = 0;
        cnt_i < Cube.querySelectorAll("div").length;
        cnt_i++
      ) {
        Cube.querySelectorAll("div")[cnt_i].style.background =
          CubeOriginalColor[cnt_i];
      }
    });
  });
});

// control panel test
let whoChanged = [];
let colorOriginal = document.querySelectorAll(".Original");
colorOriginal.forEach((colorSet, n) => {
  colorSet.value = CubeOriginalColor[n];
  colorSet.addEventListener("change", () => {
    // CubeOriginalColor[n] = colorSet.value;
    whoChanged.push([n, colorSet.value]);
  });
});

let colorHover = document.querySelectorAll(".Hover");
colorHover.forEach((colorSet, n) => {
  colorSet.value = color_template[n];
  colorSet.addEventListener("change", () => {
    // CubeOriginalColor[n] = colorSet.value;
    whoChanged.push([n + 3, colorSet.value]);
  });
});

// Update Color
let updateBtn = document.querySelector("button");
updateBtn.addEventListener("click", () => {
  // update all cubes
  // check who has change
  for (let cnt_i = 0; cnt_i < whoChanged.length; cnt_i++) {
    if (whoChanged[cnt_i][0] < 3) {
      // origin color
      // 1. update all cube
      allRows.forEach((row) => {
        row.childNodes.forEach((container, idx) => {
          let Side = whoChanged[cnt_i][0] * 2 + 1;
          container.childNodes[Side].style.background = whoChanged[cnt_i][1];
        });
      });
      // 2. update color reference
      CubeOriginalColor[whoChanged[cnt_i][0]] = whoChanged[cnt_i][1];
    } else {
      // hover color
      let shiftIdx = whoChanged[cnt_i][0] - 3;
      color_template[shiftIdx] = whoChanged[cnt_i][1];
    }
  }
});

// 向下縮的 menu?  mouseout有點怪怪的
// let ctrlPanel = document.querySelector(".ctrlPanel");
// let menu = document.querySelector(".material-symbols-outlined");
// ctrlPanel.addEventListener("mouseleave", () => {
//   ctrlPanel.style.transform = "scale(0)";
//   menu.style.transform = "scale(1)";
// });
// menu.addEventListener("click", () => {
//   ctrlPanel.style.transform = "scale(1)";
//   menu.style.transform = "scale(0)";
// });
