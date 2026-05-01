import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
        {message && <p className="mt-4 text-text-muted">{message}</p>}
      </div>
    </div>
  );
};
