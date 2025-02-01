export interface Game {
    id: string;
    name: string;
    winPoints: number;
    participationPoints: number;
    createdAt: Date;
  }
  
  export interface Player {
    id: string;
    name: string;
    playerNumber: string;
    country: string;
    color: string;
    totalPoints: number;
    createdAt: Date;
  }
  
  export interface Score {
    id: string;
    playerId: string;
    gameId: string;
    points: number;
    createdAt: Date;
  }