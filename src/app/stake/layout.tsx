export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased overflow-x-hidden">
      {children}
    </div>
  );
}
