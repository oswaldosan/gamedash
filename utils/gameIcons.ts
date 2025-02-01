import { 
  GiPingPongBat, 
  GiEightBall,
  GiChessKing, 
  GiCardAceSpades,
  GiSoccerBall,
  GiBasketballBall,
  GiVolleyballBall,
  GiTennisBall,
  GiDominoTiles,
  GiBowlingPin,
  GiDart,
  GiTabletopPlayers,
  GiGamepad,
  GiPistolGun,
  GiBattleTank,
  GiRaceCar,
  GiBoxingGlove,
  GiNinjaHeroicStance,
  GiGolfFlag
} from 'react-icons/gi';
import { SiFifa, SiEpicgames, SiRiotgames } from 'react-icons/si';
import { IconType } from 'react-icons';

export const gameIcons: { [key: string]: IconType } = {
  // Juegos Físicos
  'Ping Pong': GiPingPongBat,
  'Pool': GiEightBall,
  'Ajedrez': GiChessKing,
  'Cartas': GiCardAceSpades,
  'Fútbol': GiSoccerBall,
  'Basketball': GiBasketballBall,
  'Voleibol': GiVolleyballBall,
  'Tenis': GiTennisBall,
  'Dominó': GiDominoTiles,
  'Boliche': GiBowlingPin,
  'Dardos': GiDart,
  'Juegos de Mesa': GiTabletopPlayers,
  'MiniGolf': GiGolfFlag,
  
  // Videojuegos
  'FIFA': SiFifa,
  'Fortnite': SiEpicgames,
  'League of Legends': SiRiotgames,
  'Mario Kart': GiRaceCar,
  'Mortal Kombat': GiBoxingGlove,
  'Street Fighter': GiNinjaHeroicStance,
  'PUBG': GiPistolGun,
  'Valorant': GiBattleTank,
  'Videojuegos': GiGamepad, // Icono por defecto para videojuegos
};

export const getGameIcon = (gameName: string): IconType => {
  // Convert game name to lowercase for case-insensitive matching
  const normalizedName = gameName.toLowerCase();
  
  // Find the first icon where the key matches part of the game name
  const iconKey = Object.keys(gameIcons).find(key => 
    normalizedName.includes(key.toLowerCase())
  );
  
  // Si es un videojuego pero no encontramos un ícono específico, usar el ícono genérico
  if (normalizedName.includes('videojuego') || normalizedName.includes('game')) {
    return gameIcons['Videojuegos'];
  }
  
  // Return the matched icon or a default icon
  return iconKey ? gameIcons[iconKey] : GiTabletopPlayers;
}; 