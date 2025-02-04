import { useApp } from '@/context/AppContext';
import LeaderboardTable from '@/components/LeaderboardTable';
import FullscreenLayout from '@/components/layout/FullscreenLayout';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Game, Player, Score } from '@/types';

FullscreenLeaderboard.getLayout = (page: React.ReactNode) => (
  <FullscreenLayout>{page}</FullscreenLayout>
);

export default function FullscreenLeaderboard() {
  const { players, games, scores, loading } = useApp();
  const [localData, setLocalData] = useState({
    players: players,
    games: games,
    scores: scores
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para recargar datos de Firebase
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [gamesSnap, playersSnap, scoresSnap] = await Promise.all([
        getDocs(query(collection(db, 'games'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'players'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'scores'), orderBy('createdAt', 'desc')))
      ]);

      setLocalData({
        games: gamesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)),
        players: playersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)),
        scores: scoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Score))
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setIsRefreshing(false);
  };

  // Efecto para actualizar cada 5 minutos
  useEffect(() => {
    // Primera actualización con los datos del contexto
    setLocalData({ players, games, scores });

    // Configurar el intervalo de actualización
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000); // 5 minutos en milisegundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [players, games, scores]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-[90vw] mx-auto">
        {/* Indicador de última actualización */}
        <div className="text-white text-sm mb-4 flex justify-between items-center">
          <span>
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </span>
          {isRefreshing && (
            <span className="animate-pulse">
              Actualizando...
            </span>
          )}
        </div>
        
        <LeaderboardTable 
          players={localData.players}
          games={localData.games}
          scores={localData.scores}
          selectedGame="all"
        />
      </div>
    </div>
  );
} 