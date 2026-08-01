export default function Dashboard({ children }) {
  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div className="flex flex-col gap-20">
        {children}
      </div>
    </main>
  );
}