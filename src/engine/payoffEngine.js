export function avalanche(cards){
  return [...cards].sort((a,b)=>b.apr-a.apr);
}

export function snowball(cards){
  return [...cards].sort((a,b)=>a.balance-b.balance);
}
