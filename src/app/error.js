'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Une erreur s'est produite
        </h2>
        <p className="text-gray-600">
          {error.message || 'Une erreur inattendue est survenue'}
        </p>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
