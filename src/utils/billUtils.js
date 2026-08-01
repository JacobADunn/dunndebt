import {daysUntilDue,dueLabel} from "./dateUtils";

export function billStatus(bill){
  if(bill.isPaid) return "paid";
  const days=daysUntilDue(bill.dueDay);
  if(days<=3) return "critical";
  if(days<=7) return "urgent";
  if(days<=14) return "soon";
  return "upcoming";
}

export {dueLabel};
