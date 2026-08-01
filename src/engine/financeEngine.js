export function totalDebt(cards){
  return cards.reduce((t,c)=>t+Number(c.balance||0),0);
}

export function totalCredit(cards){
  return cards.reduce((t,c)=>t+Number(c.creditLimit||0),0);
}

export function utilization(cards){
  const debt=totalDebt(cards);
  const limit=totalCredit(cards);
  return limit?Math.round((debt/limit)*100):0;
}

export function monthlyBills(bills){
  return bills.reduce((t,b)=>t+Number(b.amount||0),0);
}
