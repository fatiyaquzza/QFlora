export interface ChemicalComponent {
  id: number;
  name: string;
}

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
  keyword_arab: string;
}

export interface SpecificPlant {
  id: number;
  name: string;
  latin_name: string;
  image_url: string;
  plant_type_id: number;
  species_id: number;
  overview: string;
  description: string;
  benefits: string;
  characteristics: string;
  origin: string;
  cultivation: string;
  source_ref: string;
  eng_name: string;
  arab_name: string;
  verses: SpecificVerse[];
  chemical_components: ChemicalComponent[];
}

// Default empty export since this is just a type definition file
export default {};
