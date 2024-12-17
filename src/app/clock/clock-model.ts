export interface Clock {
  "id": string;
  "turnTime": number;
  "games": Game[];
  "topId": number;
  "timeRemaining": number;
}

export interface Game {
  "id" : number;
  "name": string;
  "phases": Phase[];
  "topId": number;
}

export interface Phase {
  "id" : number;
  "name": string;
  "end": number;
}