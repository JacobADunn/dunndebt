import Button from "./Button";
export default function EmptyState({icon="📂",title,message,buttonLabel,onClick}){
return(
<div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
<div className="text-6xl">{icon}</div>
<h2 className="mt-4 text-3xl font-black">{title}</h2>
<p className="mt-3 text-slate-400">{message}</p>
{buttonLabel&&<Button className="mt-6" onClick={onClick}>{buttonLabel}</Button>}
</div>);
}