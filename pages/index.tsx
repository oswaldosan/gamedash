import { useApp } from '@/context/AppContext';

export default function Home() {
  const { games, players, loading } = useApp();

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Panel de Control de Competencias
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-900 mb-2">
              Juegos Activos
            </h2>
            <p className="text-3xl font-bold text-indigo-600">{games.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              Jugadores Registrados
            </h2>
            <p className="text-3xl font-bold text-green-600">{players.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
