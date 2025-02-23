'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pro-black">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pro-lime-light border-t-transparent"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-pro-lime opacity-30"></div>
      </div>
    </div>
  );
} 