import Button from "./Button";
export default function SectionHeader({title,subtitle,actionLabel,onAction}){
return(
<div className="mb-6 flex items-center justify-between">
<div><h2 className="text-3xl font-black">{title}</h2><p className="mt-2 text-slate-400">{subtitle}</p></div>
{actionLabel&&<Button onClick={onAction}>{actionLabel}</Button>}
</div>);
}