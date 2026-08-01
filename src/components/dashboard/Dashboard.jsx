import SectionHeader from "../ui/SectionHeader";

export default function Dashboard({children}){
return(
<section className="space-y-8">
<SectionHeader
 title="Dashboard"
 subtitle="Your financial command center."
/>
{children}
</section>
);
}
