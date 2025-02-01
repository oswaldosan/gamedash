import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import LeaderboardTable from '@/components/LeaderboardTable';
import Link from 'next/link';

export default function Leaderboard() {
  const { players, games, scores, loading, lastUpdate } = useApp();
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Update the "time ago" text every minute
  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
      
      if (seconds < 60) {
        setTimeAgo('hace unos segundos');
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastUpdate]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 shadow-xl rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Tabla de Posiciones
            </h1>
            <p className="text-blue-200">
              Última actualización: {timeAgo}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/fullscreen-leaderboard"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 
                text-white rounded-lg transition-colors duration-200"
            >
              Ver Pantalla Completa
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 
                text-white rounded-lg transition-colors duration-200"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Actualizar
            </button>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="rounded-lg border-0 bg-blue-700 text-white px-4 py-2 
                focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">Todos los Juegos</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <LeaderboardTable 
            players={players}
            games={games}
            scores={scores}
            selectedGame={selectedGame}
          />
        </div>
      </div>
    </div>
  );
} 