export interface ContactsModel {
  id?: number;
  isMain?: boolean;

  email?: string;
  secondEmail?: string;
  phone?: string;
  secondPhone?: string;
  vk?: string;
  telegram?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  slack?: string;
  other?: string;

  resumeId?: number | null;
  vacancyId?: number | null;
  userId?: number | null;
}
