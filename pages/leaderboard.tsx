import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Game, Player, Score } from '@/types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

type PlayerStats = {
  player: Player;
  gameScores: {
    [gameId: string]: number;
  };
};

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

  const playerStats = useMemo(() => {
    const stats: { [playerId: string]: PlayerStats } = {};

    // Initialize player stats
    players.forEach((player) => {
      stats[player.id] = {
        player,
        gameScores: {},
      };
    });

    // Calculate scores for each game
    scores.forEach((score) => {
      if (stats[score.playerId]) {
        if (!stats[score.playerId].gameScores[score.gameId]) {
          stats[score.playerId].gameScores[score.gameId] = 0;
        }
        stats[score.playerId].gameScores[score.gameId] += score.points;
      }
    });

    return Object.values(stats);
  }, [players, scores]);

  const sortedPlayers = useMemo(() => {
    return playerStats.sort((a, b) => {
      if (selectedGame === 'all') {
        const totalA = Object.values(a.gameScores).reduce((sum, score) => sum + score, 0);
        const totalB = Object.values(b.gameScores).reduce((sum, score) => sum + score, 0);
        return totalB - totalA;
      } else {
        const scoreA = a.gameScores[selectedGame] || 0;
        const scoreB = b.gameScores[selectedGame] || 0;
        return scoreB - scoreA;
      }
    });
  }, [playerStats, selectedGame]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tabla de Posiciones</h1>
            <p className="text-sm text-gray-500 mt-1">
              Última actualización: {timeAgo}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Actualizar
            </button>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-blue-900"
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

        <div className="overflow-x-auto text-blue-900">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jugador
                </th>
                {selectedGame === 'all' ? (
                  games.map((game) => (
                    <th
                      key={game.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {game.name}
                    </th>
                  ))
                ) : (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                )}
                {selectedGame === 'all' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlayers.map((playerStat, index) => (
                <tr
                  key={playerStat.player.id}
                  className={index < 3 ? 'bg-yellow-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {playerStat.player.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {playerStat.player.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  {selectedGame === 'all' ? (
                    <>
                      {games.map((game) => (
                        <td
                          key={game.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {playerStat.gameScores[game.id] || 0}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {Object.values(playerStat.gameScores).reduce(
                          (sum, score) => sum + score,
                          0
                        )}
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {playerStat.gameScores[selectedGame] || 0}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 