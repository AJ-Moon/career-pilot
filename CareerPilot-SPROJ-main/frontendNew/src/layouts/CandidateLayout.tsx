import Navigation from "../components/Navigation";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="pt-16"> {/* push content below the navbar */}
        {children}
      </div>
    </>
  );
}
