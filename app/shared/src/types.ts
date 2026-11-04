export type QueryParameters = readonly (string | number | bigint | null)[];

export interface DatabaseClient {
  all<T>(sql: string, parameters?: QueryParameters): Promise<T[]>;
  get<T>(sql: string, parameters?: QueryParameters): Promise<T | undefined>;
}

export interface EventRecord {
  id: number;
  title: string;
  date: string;
  capacity: number;
}

export interface EventWithSeatsLeft extends EventRecord {
  seatsLeft: number;
}

export type EventsQueryMode = "n_plus_one" | "optimized";
