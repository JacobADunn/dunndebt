export default function Sidebar(){
const items=["Dashboard","Bills","Credit Cards","Analytics","Settings"];
return(
<aside className="hidden lg:flex w-64 border-r border-slate-800 p-6 flex-col gap-4">
<h2 className="text-2xl font-black mb-4">💰 CC</h2>
{items.map(i=><button key={i} className="text-left rounded-xl px-4 py-3 hover:bg-slate-800">{i}</button>)}
</aside>
);
}
