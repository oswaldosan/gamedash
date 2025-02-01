import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { addDoc, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { getGameIcon } from '@/utils/gameIcons';
import debounce from 'lodash/debounce';
import { getCountryFromNumber } from '@/utils/countryConfig';

export default function Scoring() {
  const { games, players, loading } = useApp();
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [pointType, setPointType] = useState<'win' | 'participation'>('win');
  const [filteredPlayers, setFilteredPlayers] = useState<typeof players>([]);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);

  const selectedGameData = games.find((game) => game.id === selectedGame);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((number: string) => {
      if (number.length >= 4) {
        const filtered = players.filter(player => 
          player.playerNumber.toLowerCase().includes(number.toLowerCase())
        );
        setFilteredPlayers(filtered);
        setShowPlayerDropdown(true);
      } else {
        setFilteredPlayers([]);
        setShowPlayerDropdown(false);
      }
    }, 300),
    [players]
  );

  const handleNumberChange = (value: string) => {
    setSearchNumber(value);
    debouncedSearch(value);
  };

  const selectPlayer = (player: typeof players[0]) => {
    setSelectedPlayer(player.id);
    setSearchNumber(player.playerNumber);
    setShowPlayerDropdown(false);
  };

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
          {/* Game Selection Grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Seleccionar Juego
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {games.map((game) => {
                const Icon = getGameIcon(game.name);
                const isSelected = selectedGame === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3
                      ${isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {game.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Point Type Selection */}
          {selectedGame && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Puntos
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPointType('win')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200
                    ${pointType === 'win'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'}`}
                >
                  <div className="text-lg font-semibold">Victoria</div>
                  <div className="text-2xl font-bold mt-1">
                    {selectedGameData?.winPoints} pts
                  </div>
                </button>
                <button
                  onClick={() => setPointType('participation')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200
                    ${pointType === 'participation'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <div className="text-lg font-semibold">Participación</div>
                  <div className="text-2xl font-bold mt-1">
                    {selectedGameData?.participationPoints} pts
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Player Search */}
          {selectedGame && (
            <div className="relative space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Jugador
              </label>
              <input
                type="text"
                value={searchNumber}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="Ingrese el número de jugador..."
                className="h-12 mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 
                  text-gray-900 text-base px-4"
              />
              {showPlayerDropdown && filteredPlayers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                  {filteredPlayers.map((player) => {
                    const countryConfig = getCountryFromNumber(player.playerNumber);
                    return (
                      <button
                        key={player.id}
                        onClick={() => selectPlayer(player)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-900"
                      >
                        <div className={`w-8 h-8 rounded-full ${countryConfig?.bgColor || 'bg-gray-100'} 
                          flex items-center justify-center text-xs font-bold ${countryConfig?.textColor || 'text-gray-600'}`}
                        >
                          #{player.playerNumber}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-500">{countryConfig?.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedPlayer && !showPlayerDropdown && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jugador Seleccionado
                  </label>
                  <div className="flex items-center space-x-3 h-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
                    {(() => {
                      const player = players.find(p => p.id === selectedPlayer);
                      const countryConfig = player ? getCountryFromNumber(player.playerNumber) : null;
                      return (
                        <>
                          <div className={`w-8 h-8 rounded-full ${countryConfig?.bgColor || 'bg-gray-100'} 
                            flex items-center justify-center text-xs font-bold ${countryConfig?.textColor || 'text-gray-600'}`}
                          >
                            #{player?.playerNumber}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{player?.name}</div>
                            <div className="text-sm text-gray-500">{countryConfig?.name}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 