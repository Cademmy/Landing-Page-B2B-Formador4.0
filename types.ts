
export interface SubtopicSchema {
  title: string;
  items: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  objective?: string;
  particularObjectives?: string[]; // Para objetivos específicos (Cognitivo, Psicomotor, Afectivo)
  expectedResults?: string[];
  subtopics?: SubtopicSchema[];
  methodology?: string;
  assessment?: string;
  resources?: string[]; // Recursos didácticos específicos
  bibliography?: string[];
  benefits: string[];
  priceB2C: number;
  priceB2B: number;
  duration: string;
  date: string;
  time: string;
  modality: string;
  icon: string;
  skills: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}
