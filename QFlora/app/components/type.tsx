export interface FavoritePlant {
  id: number;
  specific_plant_id: number;
  SpecificPlant: SpecificPlant;
}

export interface SpecificVerse {
  id: number;
  surah: string;
  verse_number: number;
  quran_verse: string;
  translation: string;
  audio_url: string;
}

export interface SpecificPlantClassification {
  id: number;
  specific_plant_id: number;
  kingdom: string;
  subkingdom: string;
  superdivision: string;
  division: string;
  class: string;
  subclass: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpecificPlant {
  id: number;
  name: string;
  latin_name: string;
  image_url: string;
  plant_type: "Buah" | "Sayur" | "Bunga";
  overview: string;
  description: string;
  benefits: string;
  characteristics: string;
  origin: string;
  chemical_comp: string;
  cultivation: string;
  source_ref: string;
  verses: SpecificVerse[];
  classifications: SpecificPlantClassification[];
}
