export interface Country {
  name: string;
  flag?: string;
}

export interface CountryAPIResponse {
  name: { common: string };
  flags: { png: string };
}