export default function LegalLayout({ children }) {
  return (
    <div className="legal-layout">
      <main className="legal-main">{children}</main>

      <style jsx>{`
        .legal-layout {
          flex: 1;
          padding: 3rem 0;
        }
        .legal-main {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      `}</style>
    </div>
  );
}