import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getCountryFromNumber } from '@/utils/countryConfig';
import { getGameIcon } from '@/utils/gameIcons';
import FullscreenLayout from '@/components/layout/FullscreenLayout';

CheckPoints.getLayout = (page: React.ReactNode) => (
  <FullscreenLayout>{page}</FullscreenLayout>
);

export default function CheckPoints() {
  const { players, games, scores } = useApp();
  const [searchNumber, setSearchNumber] = useState('');
  const [playerData, setPlayerData] = useState<{
    player: typeof players[0];
    scores: Array<{
      game: typeof games[0];
      points: number;
    }>;
    totalPoints: number;
  } | null>(null);

  const handleSearch = (number: string) => {
    setSearchNumber(number);
    
    if (number.length >= 4) {
      const player = players.find(p => p.playerNumber === number);
      
      if (player) {
        const playerScores = scores
          .filter(score => score.playerId === player.id)
          .reduce((acc, score) => {
            const game = games.find(g => g.id === score.gameId);
            if (game) {
              const existingScore = acc.find(s => s.game.id === game.id);
              if (existingScore) {
                existingScore.points += score.points;
              } else {
                acc.push({ game, points: score.points });
              }
            }
            return acc;
          }, [] as Array<{ game: typeof games[0]; points: number }>);

        const totalPoints = playerScores.reduce((sum, score) => sum + score.points, 0);

        setPlayerData({
          player,
          scores: playerScores,
          totalPoints
        });
      } else {
        setPlayerData(null);
      }
    } else {
      setPlayerData(null);
    }
  };

  const countryConfig = playerData?.player 
    ? getCountryFromNumber(playerData.player.playerNumber)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Input Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-8">
            Consulta tus Puntos
          </h1>
          <input
            type="text"
            value={searchNumber}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ingresa tu número de jugador"
            className="w-full h-16 px-6 text-2xl text-center rounded-xl border-2 border-blue-300 
              focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 
              bg-white/10 text-white placeholder-blue-200"
          />
        </div>

        {/* Results Section */}
        {playerData && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Player Header */}
            <div className={`p-6 ${countryConfig?.bgColor || 'bg-gray-100'}`}>
              <div className="flex space-x-4 justify-around">
                <div className={`w-16 h-16 rounded-full ${countryConfig?.bgColor || 'bg-gray-200'} 
                  flex items-center justify-center text-xl font-bold ${countryConfig?.textColor || 'text-gray-700'}
                  border-2 border-white shadow-lg`}
                >
                  #{playerData.player.playerNumber}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {playerData.player.name}
                  </h2>
                  <p className={`text-lg ${countryConfig?.textColor || 'text-gray-600'}`}>
                    {countryConfig?.name}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-600">Puntos Totales</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {playerData.totalPoints}
                  </div>
                </div>
              </div>
            </div>

            {/* Scores List */}
            <div className="divide-y divide-gray-200">
              {playerData.scores.map(({ game, points }) => {
                const GameIcon = getGameIcon(game.name);
                return (
                  <div key={game.id} className="py-4 px-16 flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <GameIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {game.name}
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {points} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {searchNumber.length >= 4 && !playerData && (
          <div className="text-center text-xl text-white bg-red-500/20 rounded-lg p-4">
            No se encontró ningún jugador con ese número
          </div>
        )}
      </div>
    </div>
  );
} 