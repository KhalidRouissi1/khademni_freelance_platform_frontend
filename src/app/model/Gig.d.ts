export interface Gig {
    id: number;
    title: string;
    description: string;
    minPrice: number;
    maxPrice: number;
    requiredSkills: string[];
    username: string;
    createdAt: Date;
  }