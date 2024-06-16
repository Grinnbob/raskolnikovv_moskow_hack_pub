interface Rating {
  score: number;
  totalScore: number;
  rating: number; // 0-100%
  details: any; // for debugging and improvements
  overlap: any;
  createdAt: Date;
}

export interface ResumeVacancyRating extends Rating {
  type: 'resume-vacancy';
  resumeId: number;
  vacancyId: number;
}

export interface ResumeResumeRating extends Rating {
  type: 'resume-resume';
  resumeId: number;
  co_resume: number;
}

export interface VacancyVacancyRating extends Rating {
  type: 'vacancy-vacancy';
  vacancyId: number;
  co_vacancyId: number;
}
