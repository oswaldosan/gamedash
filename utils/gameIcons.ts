import { 
  GiPingPongBat, 
  GiPoolDive, 
  GiChessKing, 
  GiCardAceSpades,
  GiSoccerBall,
  GiBasketballBall,
  GiVolleyballBall,
  GiTennisBall,
  GiDominoTiles,
  GiBowlingPin,
  GiDart,
  GiTabletopPlayers
} from 'react-icons/gi';
import { IconType } from 'react-icons';

export const gameIcons: { [key: string]: IconType } = {
  'Ping Pong': GiPingPongBat,
  'Pool': GiPoolDive,
  'Ajedrez': GiChessKing,
  'Cartas': GiCardAceSpades,
  'Fútbol': GiSoccerBall,
  'Basketball': GiBasketballBall,
  'Voleibol': GiVolleyballBall,
  'Tenis': GiTennisBall,
  'Dominó': GiDominoTiles,
  'Boliche': GiBowlingPin,
  'Dardos': GiDart,
  'Juegos de Mesa': GiTabletopPlayers
};

export const getGameIcon = (gameName: string): IconType => {
  // Convert game name to lowercase for case-insensitive matching
  const normalizedName = gameName.toLowerCase();
  
  // Find the first icon where the key matches part of the game name
  const iconKey = Object.keys(gameIcons).find(key => 
    normalizedName.includes(key.toLowerCase())
  );
  
  // Return the matched icon or a default icon
  return iconKey ? gameIcons[iconKey] : GiTabletopPlayers;
}; 