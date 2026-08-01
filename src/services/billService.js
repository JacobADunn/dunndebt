export function createBill(data){
  return {
    id: crypto.randomUUID(),
    isPaid:false,
    autoPay:false,
    notes:"",
    ...data,
  };
}

export function updateBill(list,bill){
  return list.map(b=>b.id===bill.id?bill:b);
}

export function deleteBill(list,id){
  return list.filter(b=>b.id!==id);
}

export function toggleBillPaid(list,id){
  return list.map(b=>b.id===id?{...b,isPaid:!b.isPaid}:b);
}
