export interface Gig {
    id: number;
    title: string;
    description: string;
    minPrice: number;
    maxPrice: number;
    requiredSkills: string[];
    creatorEmail: string;
    createdAt: Date;
  }