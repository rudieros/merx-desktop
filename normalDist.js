const NormalDistribution = require('normal-distribution').default;

var spareRandom = null;

const normDist = new NormalDistribution();

// function normalRandom()
// {
//   var val, u, v, s, mul;
//
//   if(spareRandom !== null)
//   {
//     val = spareRandom;
//     spareRandom = null;
//   }
//   else
//   {
//     do
//     {
//       u = Math.random()*2-1;
//       v = Math.random()*2-1;
//
//       s = u*u+v*v;
//     } while(s === 0 || s >= 1);
//
//     mul = Math.sqrt(-2 * Math.log(s) / s);
//
//     val = u * mul;
//     spareRandom = v * mul;
//   }
//
//   return val;
// }

for (let i = 0; i < 100; i++) {
  console.log(normDist.pdf(Math.random()));
}
