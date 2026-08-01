export function totalDebt(cards){
  return cards.reduce((t,c)=>t+Number(c.balance||0),0);
}

export function totalBills(bills){
  return bills.reduce((t,b)=>t+Number(b.amount||0),0);
}

export function totalMinimumPayments(cards){
  return cards.reduce((t,c)=>t+Number(c.minimumPayment||0),0);
}

export function utilization(card){
  if(!card.creditLimit) return 0;
  return Math.round((card.balance/card.creditLimit)*100);
}

export function averageUtilization(cards){
  if(!cards.length) return 0;
  return Math.round(cards.reduce((t,c)=>t+utilization(c),0)/cards.length);
}
