export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">{children}</div>

      <style jsx>{`
        .auth-layout {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
        }
        .auth-layout-container {
          width: 100%;
          max-width: 32rem;
        }
      `}</style>
    </div>
  );
}