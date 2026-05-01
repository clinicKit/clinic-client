export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-bg-card rounded-md shadow-sm border border-border-light p-5 ${className}`}>
    {children}
  </div>
);