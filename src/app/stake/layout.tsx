export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased sm:bg-[url('/bg-desktop.png')] bg-[url('/mobile-bg1.png')] bg-no-repeat bg-contain sm:bg-cover sm:bg-[position:center_-70px] overflow-x-hidden">
      {children}
    </div>
  );
}
