export function totalPayment(card,extra=0){
  return Number(card.minimumPayment||0)+Number(extra||0);
}

export function remainingBalance(card,extra=0){
  return Math.max(0,Number(card.balance)-totalPayment(card,extra));
}

export function availableCredit(card){
  return Number(card.creditLimit)-Number(card.balance);
}
