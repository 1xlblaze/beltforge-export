export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price_usd: number;
  moq: number;
  material: string;
  width_cm: number;
  image_url: string;
  category: string;
  featured: boolean;
  export_ready: boolean;
};

export type ExportQuoteRequest = {
  country_code: string;
  total_units: number;
  declared_value_usd: number;
};

export type ExportQuoteResponse = {
  country_code: string;
  shipping_usd: number;
  duties_estimate_usd: number;
  documentation_fee_usd: number;
  total_landed_estimate_usd: number;
  eta_days: number;
  currency: string;
  service: string;
};
