export class Street {
  HighlightedName: string;
  Latitude: number;
  Longitude: number;
  Name: string;
  Score: number;
  SuggestionType: number;
  UniqueIdentifier: string;
}

export class StreetSpecific {
  ClosestDistance: number;
  CommuneBfsNumber: number;
  Country: number;
  CountryCode: string;
  EntranceAddressUniqueIdentifier: string;
  ExecutionTime: string;
  FormattedAddress: string;
  GeoQuality: number;
  Height: number;
  LV95_E: number;
  LV95_N: number;
  Latitude: number;
  Locality: string;
  LocalityUniqueIdentifier: string;
  Longitude: number;
  OptimizedRequest: boolean;
  State: string;
  StateShort: string;
  StateUniqueIdentifier: string;
  Street: string;
  StreetNumber: string;
  StreetUniqueIdentifier: string;
  Zip: string;
}
