let points0 = [
  0, 40,
  1, 35,
  7, 20, 
  16, 8,
  28, 2,
  40, 0,
  
  51, 2,
  63, 10,
  72, 20,
  77, 35,
  78, 40,
  
  78, 59,
  77, 64,
  72, 79,
  63, 89,
  51, 97,
  
  40, 99,
  28, 97,
  16, 91,
  7, 79,
  1, 64,
  0, 59,
  0, 40
];

let points1 = [ 40, 99, 40, 0];

let points2 = [ 0, 25,
               2, 22,
              6, 13, 
              17, 5,
              28, 2,
              40, 0,
              52, 2,
              63, 5,
              74, 13,
              79, 23,
              79, 28,
              74, 38,
               63, 46,
              51, 54,
              40, 58,
              29, 62,
              17, 68,
              8, 80,
              0, 99,
              79, 99
              ];

let points4 = [ 60, 99, 60, 0, 0, 75, 79, 75 ];

let points8 = [
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  
  52, 39,
  62, 34,
  69, 29,
  72, 23,
  72, 19,
  69, 12,
  62, 6,
  52, 2,
  40, 0,
  
  28, 2,
  18, 6,
  11, 12,
  8, 19,
  8, 23,
  11, 29,
  18, 34,
  28, 39,
  40, 40,
  ];

let points6 = [
  50, 0,
  4, 56,
  1, 66,
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  40, 40,
  26, 42,
  15, 46,
  4, 56,
  ];

let points3 = [
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  40, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  52, 42,
  39, 40,
  79, 0,
  1, 0
  ];

let points7 = [ 0, 0, 79, 0, 30, 99 ];

let points9 = [];
let points5 = [
  1, 77,
  6, 87,
  17, 94,
  28, 97,
  38, 99,
  42, 99,
  52, 97,
  63, 94,
  74, 87,
  79, 77,
  79, 66,
  75, 56,
  64, 46,
  54, 42,
  40, 40,
  26, 42,
  15, 46,
  27,  0,
  79,  0,
];

// create 5 from 2  //
/* uncomment if you want the 5 to look more authentic (but uglier)
for (let idx=0; idx*2 < points2.length; idx++) {
   points5[idx*2] = points2[idx*2];
   points5[idx*2+1] = 99-points2[idx*2+1];
}
*/
// create 9 from 6 
for (let idx=0; idx*2 < points6.length; idx++) {
   points9[idx*2] = 79-points6[idx*2];
   points9[idx*2+1] = 99-points6[idx*2+1];
}

pointsArray = [points0, points1, points2, points3, points4, points5, points6, points7, points8, points9];

/* flatten function: convert 2D array into 1D ( length1, val1, val2, ... length2, valx, valx,....) */
function flatten2DArray(arr) {
  let flatArr = [];
  for(let oIdx = 0; oIdx < arr.length; oIdx++) {
    let innerArr = arr[oIdx];
    flatArr.push(innerArr.length);
    for(let iIdx = 0; iIdx < innerArr.length; iIdx++) {
      flatArr.push(innerArr[iIdx]);
    }
  }
  return flatArr;
}
/* restore function -- use in watch code */
function rebuild2DArray(arr) {
  let Arr2D = [];
  let outerArrIdx = 0;
  //console.log('max='+arr.length);
  while(outerArrIdx < arr.length) {
    let innerArrLength = arr[outerArrIdx++];
    //console.log('len: '+innerArrLength);
    let innerArr = [];
    while( innerArrLength-- > 0) {
      innerArr.push(arr[outerArrIdx]);
      //console.log('pushing '+arr[outerArrIdx]);
      outerArrIdx++;
    }
    Arr2D.push(innerArr);
    //console.log('idx='+outerArrIdx);
  }
  return Arr2D;
}

let tiny = btoa(require('heatshrink').compress(flatten2DArray(pointsArray)));
console.log(tiny);

/* use this in the watch code to restore and use 
let pts = 'l0AlEBkcHikQhEcgUogEzgU/hVIilNkdOlFOndNoFIp8/rMzsMosccsMQrcHp8BoEAnYrBggOBEwIBBjMCi0GhsRgozDmgzBgtKhtPi9PjlKk0/l0zm0onUdn0RokIqEAsdPscggNNg1XiNeIAI1Bmlhn9epVXp9Np9Cpc4oEumkqk8op8AgMAhE8sc8QYNLp9LkwpHk1jlQrOm0qlEojUqh8ujcAGIMomUAgk4gNCKzIqFEYMGKoItBj1jpgPHGZJgVmknn0iosdpEXpETosMn0GaYLXBbYMSg0LhkIicIi8LjsSkUcV4IABjtjpcrp0hp0WpIiBgszgUngEbgUQgsFhkAi0AkMElcPmsbnMnnc1nNAmojB';
pointsArray = rebuild2DArray(require('heatshrink').decompress(atob(pts)));
*/
