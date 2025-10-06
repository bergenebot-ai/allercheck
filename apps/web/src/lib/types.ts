export type AlergoCodi = 'gluten' | 'fruits-secs' | 'lactosa' | string;

export interface InformeMedic {
  id: string;
  dataISO: string;
  notes?: string;
  alergies: {
    codi: AlergoCodi;
    severitat: 'baixa' | 'moderada' | 'alta';
  }[];
}

export interface Comensal {
  id: string;
  nom: string;
  dieta?: string;
  informes: InformeMedic[];
}

export interface FitxaProveidor {
  versio: string;
  dataISO: string;
  declaracioAlergens: {
    codi: AlergoCodi;
    present: boolean;
    potContenir?: boolean;
  }[];
}

export interface Proveidor {
  id: string;
  nom: string;
  fitxes: FitxaProveidor[];
}

export interface Ingredient {
  id: string;
  nom: string;
  proveidorId: string;
  alergens: AlergoCodi[];
  potContenir?: AlergoCodi[];
  dataDeclaracio: string;
}

export interface PlatIngredient {
  idIng: string;
  quantitat: number;
  unitat: 'g' | 'ml' | 'u';
}

export interface Plat {
  id: string;
  nom: string;
  ingredients: PlatIngredient[];
  alergensDerivats?: AlergoCodi[];
  versio: string;
  cost?: number;
}

export interface Assignacio {
  comensalId: string;
  platId: string;
}

export type EstatValidacio =
  | 'BORRADOR'
  | 'VALIDAT_1_2'
  | 'VALIDAT_2_2'
  | 'CERTIFICAT'
  | 'REVISIO';

export interface Segell {
  rol: 'DN' | 'TA';
  usuari: string;
  dataISO: string;
}

export interface Menu {
  id: string;
  dataISO: string;
  torn: 'esmorzar' | 'dinar' | 'sopar';
  plats: string[];
  assignacions: Assignacio[];
  estat: EstatValidacio;
  segells: Segell[];
}

export interface Canvi {
  id: string;
  tipus: 'FITXA_PROVEIDOR' | 'RECEPTARI' | 'ALTRE';
  entitatId: string;
  descripcio: string;
  dataISO: string;
}

export type IncidentSeveritat = 'ERROR' | 'RISC' | 'REVISIO';

export interface Traçabilitat {
  ingredientId: string;
  proveidorId: string;
  versioFitxa?: string;
}

export interface ValidationIncident {
  id: string;
  comensalId: string;
  platId: string;
  alergogen: AlergoCodi;
  severitat: IncidentSeveritat;
  descripcio: string;
  traçabilitat: Traçabilitat;
}

export interface ValidationSummary {
  menuId: string;
  incidents: ValidationIncident[];
  generatedAt: string;
}

export interface AuditEntry {
  id: string;
  tipus: string;
  usuari: string;
  rol: string;
  dataISO: string;
  accio: string;
  abans: string;
  despres: string;
  hash: string;
}

export interface FeatureToggles {
  nutricional: boolean;
  escandall: boolean;
  compres: boolean;
  conservacio: boolean;
  plansPreu: boolean;
  rols: boolean;
}

export interface PersistedState {
  comensals: Comensal[];
  proveidors: Proveidor[];
  ingredients: Ingredient[];
  plats: Plat[];
  menus: Menu[];
  canvis: Canvi[];
  auditories: AuditEntry[];
  toggles: FeatureToggles;
  anonimitza: boolean;
}
