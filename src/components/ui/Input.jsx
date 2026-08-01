export default function Input({label,className="",...props}){
return (
<div>
<label className="mb-2 block text-sm text-slate-400">{label}</label>
<input {...props} className={`w-full rounded-2xl border border-slate-700 bg-slate-800 p-3 outline-none transition focus:border-sky-500 ${className}`}/>
</div>
);
}
