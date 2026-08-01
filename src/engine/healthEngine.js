export function healthScore({avgUtilization=0,onTimeRate=100}){
  let score=100;
  score-=Math.min(avgUtilization,100)*0.4;
  score-=Math.max(0,100-onTimeRate)*0.3;
  return Math.max(0,Math.round(score));
}
