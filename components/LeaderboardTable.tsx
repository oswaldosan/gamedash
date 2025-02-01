import { useMemo } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { getCountryFromNumber } from '@/utils/countryConfig';
import { Game, Player, Score } from '@/types';

type PlayerStats = {
  player: Player;
  gameScores: {
    [gameId: string]: number;
  };
};

interface LeaderboardTableProps {
  players: Player[];
  games: Game[];
  scores: Score[];
  selectedGame: string;
}

export default function LeaderboardTable({ players, games, scores, selectedGame }: LeaderboardTableProps) {
  const playerStats = useMemo(() => {
    const stats: { [playerId: string]: PlayerStats } = {};
    players.forEach((player) => {
      stats[player.id] = { player, gameScores: {} };
    });

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

  return (
    <table className="min-w-full bg-white rounded-xl overflow-hidden">
      <thead className="bg-gray-50">
        <tr className="text-left border-b-4 border-gray-200">
          <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-20">
            Pos.
          </th>
          <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Jugador
          </th>
          {selectedGame === 'all' ? (
            games.map((game) => (
              <th key={game.id} className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {game.name}
              </th>
            ))
          ) : (
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Puntos
            </th>
          )}
          {selectedGame === 'all' && (
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Total
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {sortedPlayers.map((playerStat, index) => {
          const countryConfig = getCountryFromNumber(playerStat.player.playerNumber);
          const isTopThree = index < 3;
          const position = index + 1;
          
          return (
            <tr
              key={playerStat.player.id}
              className={`${
                isTopThree ? `${countryConfig?.bgColor || 'bg-gray-50'} hover:bg-opacity-80` 
                : 'hover:bg-gray-50'
              } transition-colors duration-150`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {isTopThree ? (
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                      ${position === 1 ? 'bg-yellow-100 text-yellow-800' :
                        position === 2 ? 'bg-gray-100 text-gray-800' :
                        'bg-amber-100 text-amber-800'}`}>
                      <TrophyIcon className="w-6 h-6" />
                    </div>
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center text-2xl font-bold text-gray-500">
                      {position}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${countryConfig?.bgColor || 'bg-gray-100'} 
                    flex items-center justify-center ${countryConfig?.textColor || 'text-gray-600'}
                    shadow-sm`}
                  >
                    <span className="text-sm font-bold">
                      #{playerStat.player.playerNumber}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {playerStat.player.name}
                    </div>
                    <div className={`text-sm ${countryConfig?.textColor || 'text-gray-500'}`}>
                      {countryConfig?.name || 'País no definido'}
                    </div>
                  </div>
                </div>
              </td>
              {selectedGame === 'all' ? (
                <>
                  {games.map((game) => (
                    <td key={game.id} className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl font-bold text-gray-700">
                        {playerStat.gameScores[game.id] || 0}
                      </span>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-3xl font-bold text-blue-600">
                      {Object.values(playerStat.gameScores).reduce(
                        (sum, score) => sum + score,
                        0
                      )}
                    </span>
                  </td>
                </>
              ) : (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-3xl font-bold text-blue-600">
                    {playerStat.gameScores[selectedGame] || 0}
                  </span>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
} 