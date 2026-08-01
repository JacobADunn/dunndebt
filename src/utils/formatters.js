export function formatCurrency(value){
  return new Intl.NumberFormat("en-US",{
    style:"currency",
    currency:"USD"
  }).format(Number(value||0));
}

export function formatPercent(value){
  return `${Number(value||0).toFixed(0)}%`;
}

export function formatDate(date){
  return new Date(date).toLocaleDateString();
}
