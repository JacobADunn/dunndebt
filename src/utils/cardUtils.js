export function utilization(card){
  if(!card.creditLimit) return 0;
  return Math.round((card.balance/card.creditLimit)*100);
}

export function availableCredit(card){
  return Number(card.creditLimit)-Number(card.balance);
}
