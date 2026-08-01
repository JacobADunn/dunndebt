export function daysUntilDue(dueDay){
  const today=new Date();
  const due=new Date(today.getFullYear(),today.getMonth(),dueDay);
  if(due<new Date(today.getFullYear(),today.getMonth(),today.getDate())){
    due.setMonth(due.getMonth()+1);
  }
  return Math.round((due-new Date(today.getFullYear(),today.getMonth(),today.getDate()))/86400000);
}

export function dueLabel(dueDay){
  const days=daysUntilDue(dueDay);
  if(days===0) return "Due Today";
  if(days===1) return "Due Tomorrow";
  return `Due in ${days} days`;
}
