export default function ProgressBar({value=0,color="bg-sky-500"}){
const width=Math.max(0,Math.min(100,value));
return(
<div className="h-3 overflow-hidden rounded-full bg-slate-800">
<div className={`${color} h-full rounded-full transition-all duration-500`} style={{width:`${width}%`}}/>
</div>
);
}
