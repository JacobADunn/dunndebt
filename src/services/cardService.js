export function createCard(data){
  return {
    id:crypto.randomUUID(),
    isPaidThisMonth:false,
    paymentHistory:[],
    ...data,
  };
}

export function updateCard(list,card){
  return list.map(c=>c.id===card.id?card:c);
}

export function deleteCard(list,id){
  return list.filter(c=>c.id!==id);
}
