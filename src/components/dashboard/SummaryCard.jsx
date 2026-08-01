import StatCard from "../ui/StatCard";

export default function SummaryCard({
  title,
  value,
  icon,
  accent = "text-white",
  footer = "",
}) {
  return (
    <StatCard
      title={title}
      value={value}
      icon={icon}
      accent={accent}
      footer={footer}
    />
  );
}