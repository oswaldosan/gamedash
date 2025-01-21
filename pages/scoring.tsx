import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { addDoc, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { getGameIcon } from '@/utils/gameIcons';

export default function Scoring() {
  const { games, players, loading } = useApp();
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [pointType, setPointType] = useState<'win' | 'participation'>('win');

  const selectedGameData = games.find((game) => game.id === selectedGame);

  const handleScore = async () => {
    if (!selectedGame || !selectedPlayer) {
      toast.error('Por favor selecciona un juego y un jugador');
      return;
    }

    try {
      const points = pointType === 'win' 
        ? selectedGameData?.winPoints 
        : selectedGameData?.participationPoints;

      // 1. Agregar el nuevo score
      await addDoc(collection(db, 'scores'), {
        gameId: selectedGame,
        playerId: selectedPlayer,
        points: points,
        createdAt: new Date(),
      });

      // 2. Actualizar los puntos totales del jugador
      const playerRef = doc(db, 'players', selectedPlayer);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const currentPoints = playerDoc.data().totalPoints || 0;
        await updateDoc(playerRef, {
          totalPoints: currentPoints + points
        });
      }

      toast.success('¡Puntos registrados exitosamente!');
      // Reset player selection but keep game selected for multiple entries
      setSelectedPlayer('');
    } catch (error) {
      console.error('Error al registrar puntos:', error);
      toast.error('Error al registrar los puntos');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Registrar Puntos</h2>
        <div className="space-y-6">
          {/* Game Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Juego
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                focus:border-indigo-500 focus:ring-indigo-500 
                text-gray-900 text-base px-4 appearance-none bg-white"
            >
              <option value="" className="text-gray-400">Selecciona un juego...</option>
              {games.map((game) => {
                const Icon = getGameIcon(game.name);
                return (
                  <option key={game.id} value={game.id} className="text-gray-900">
                    {game.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Point Type Selection */}
          {selectedGame && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Puntos
              </label>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 form-radio text-indigo-600 focus:ring-indigo-500"
                    name="pointType"
                    value="win"
                    checked={pointType === 'win'}
                    onChange={(e) => setPointType(e.target.value as 'win' | 'participation')}
                  />
                  <span className="ml-3 text-base text-gray-900">
                    Victoria ({selectedGameData?.winPoints} puntos)
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 form-radio text-indigo-600 focus:ring-indigo-500"
                    name="pointType"
                    value="participation"
                    checked={pointType === 'participation'}
                    onChange={(e) => setPointType(e.target.value as 'win' | 'participation')}
                  />
                  <span className="ml-3 text-base text-gray-900">
                    Participación ({selectedGameData?.participationPoints} puntos)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Player Selection */}
          {selectedGame && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Jugador
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  text-gray-900 text-base px-4 appearance-none bg-white"
              >
                <option value="" className="text-gray-400">Selecciona un jugador...</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id} className="text-gray-900">
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          {selectedGame && selectedPlayer && (
            <button
              onClick={handleScore}
              className="w-full h-12 inline-flex justify-center items-center rounded-lg border 
                border-transparent bg-indigo-600 px-6 text-base font-medium text-white 
                shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 
                focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Registrar Puntos
            </button>
          )}
        </div>
      </div>

      {/* Recent Scores */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Últimos Puntos Registrados</h2>
        <RecentScores selectedGame={selectedGame} />
      </div>
    </div>
  );
}

// Separate component for recent scores
function RecentScores({ selectedGame }: { selectedGame: string }) {
  const { scores, players, games, loading } = useApp();

  const recentScores = scores
    .filter((score) => !selectedGame || score.gameId === selectedGame)
    .slice(0, 10) // Show only last 10 scores
    .map((score) => ({
      ...score,
      player: players.find((p) => p.id === score.playerId),
      game: games.find((g) => g.id === score.gameId),
    }));

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jugador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Juego
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Puntos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recentScores.map((score) => (
            <tr key={score.id} className="text-blue-900">
              <td className="px-6 py-4 whitespace-nowrap">
                {score.player?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {score.game && getGameIcon(score.game.name)({ className: 'h-5 w-5 mr-2 text-gray-500' })}
                  {score.game?.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {score.points} puntos
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(score.createdAt).toLocaleString('es-ES')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 