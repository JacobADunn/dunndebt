export function calculatePayment(card,extra=0){
  return Number(card.minimumPayment||0)+Number(extra||0);
}

export function applyPayment(card,extra=0){
  const payment=calculatePayment(card,extra);
  return {
    ...card,
    balance:Math.max(0,Number(card.balance)-payment),
    isPaidThisMonth:true,
    paymentHistory:[
      ...(card.paymentHistory||[]),
      {
        id:crypto.randomUUID(),
        amount:payment,
        date:new Date().toISOString()
      }
    ]
  };
}
