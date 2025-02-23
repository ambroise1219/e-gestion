import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Page non trouvée
        </h2>
        <p className="text-gray-600">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <Link href="/" className="btn btn-primary inline-block">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
