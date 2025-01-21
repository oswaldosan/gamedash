import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Game, Player, Score } from '@/types';

interface AppContextType {
  games: Game[];
  players: Player[];
  scores: Score[];
  loading: boolean;
  lastUpdate: Date;
}

const AppContext = createContext<AppContextType>({
  games: [],
  players: [],
  scores: [],
  loading: true,
  lastUpdate: new Date(),
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Suscripción en tiempo real a los juegos
    const unsubscribeGames = onSnapshot(
      query(collection(db, 'games'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const gamesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Game));
        setGames(gamesData);
        setLastUpdate(new Date());
      }
    );

    // Suscripción en tiempo real a los jugadores
    const unsubscribePlayers = onSnapshot(
      query(collection(db, 'players'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const playersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Player));
        setPlayers(playersData);
        setLastUpdate(new Date());
      }
    );

    // Suscripción en tiempo real a los puntajes
    const unsubscribeScores = onSnapshot(
      query(collection(db, 'scores'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const scoresData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Score));
        setScores(scoresData);
        setLastUpdate(new Date());
      }
    );

    // Cargar datos iniciales
    const loadInitialData = async () => {
      try {
        const [gamesSnap, playersSnap, scoresSnap] = await Promise.all([
          getDocs(query(collection(db, 'games'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'players'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'scores'), orderBy('createdAt', 'desc')))
        ]);

        setGames(gamesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game)));
        setPlayers(playersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
        setScores(scoresSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Score)));
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      unsubscribeGames();
      unsubscribePlayers();
      unsubscribeScores();
    };
  }, []);

  return (
    <AppContext.Provider value={{ games, players, scores, loading, lastUpdate }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);