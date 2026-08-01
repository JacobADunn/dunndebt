export function monthlyInterest(balance,apr){
  return Number(((balance*(apr/100))/12).toFixed(2));
}

export function projectedBalance(balance,apr,payment){
  const interest=monthlyInterest(balance,apr);
  return Math.max(0,Number((balance+interest-payment).toFixed(2)));
}
