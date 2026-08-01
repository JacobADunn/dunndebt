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
        md:py-10
        lg:px-8
        lg:py-12
      "
    >
      <div className="flex flex-col gap-16 lg:gap-20">
        {children}
      </div>
    </main>
  );
}