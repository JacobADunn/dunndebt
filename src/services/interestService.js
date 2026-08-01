export function estimateMonthlyInterest(card){
  const apr=Number(card.apr||0)/100;
  return Number(((card.balance*apr)/12).toFixed(2));
}

export function applyMonthlyInterest(card){
  const interest=estimateMonthlyInterest(card);
  return {
    ...card,
    balance:Number((card.balance+interest).toFixed(2)),
    lastInterest:interest
  };
}
