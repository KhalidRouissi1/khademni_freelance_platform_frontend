export interface Gig {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  maxPrice: number;
  minPrice: number;
  username: string;
  createdAt: Date;
  image?: Image;
  
  imageStr?: string;
}