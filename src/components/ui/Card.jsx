export default function Card({children,className=""}){
return (
<div className={`rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 ${className}`}>
{children}
</div>
);
}
