import { useApp } from '@/context/AppContext';
import LeaderboardTable from '@/components/LeaderboardTable';
import FullscreenLayout from '@/components/layout/FullscreenLayout';

FullscreenLeaderboard.getLayout = (page: React.ReactNode) => (
  <FullscreenLayout>{page}</FullscreenLayout>
);

export default function FullscreenLeaderboard() {
  const { players, games, scores, loading } = useApp();

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-[90vw] mx-auto">
        <LeaderboardTable 
          players={players}
          games={games}
          scores={scores}
          selectedGame="all"
        />
      </div>
    </div>
  );
} 