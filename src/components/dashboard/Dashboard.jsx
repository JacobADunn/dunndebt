export default function Dashboard({ children }) {
  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-4
        py-6
        sm:px-6
        md:py-8
        lg:px-8
        lg:py-10
      "
    >
      <div className="flex flex-col gap-8 lg:gap-10">
        {children}
      </div>
    </main>
  );
}