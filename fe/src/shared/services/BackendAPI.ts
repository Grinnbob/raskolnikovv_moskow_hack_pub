import { AxiosResponse } from 'axios';

import $api from '../http';
import { ContactsModel } from '../types/models/contacts.model';
import { EducationOrganizationModel } from '../types/models/education.model';
import { ResumeModel } from '../types/models/resume.model';
import { BenefitModel, VacancyModel } from '../types/models/vacancy.model';
import { CategoryModel } from '../types/models/category.model';
import { IndustryModel } from '../types/models/industry.model';
import { PaginatedResponse } from '../types/models/response/PaginationResponse';
import { CityModel } from '../types/models/city.model';
import { UserReactionsCounts } from '../types/models/response/ReactionsCountsResponse';
import { SkillModel } from '../types/models/skills.model';
import { LanguageModel } from '../types/models/language.model';
import {
  CompanyModel,
  CompanyRatingsModel,
} from '../types/models/company.model';
import { CitizenshipModel } from '../types/models/citizenship.model';
import { UserModel } from '../types/models/user.model';
import { ValidationResponse } from '../types/models/response/ValidationResponse';
import { Roles } from '../types/models/role.model';
import {
  ResumeCommentModel,
  VacancyCommentModel,
} from '../types/models/comment.model';
import {
  ResumeComplaintModel,
  VacancyComplaintModel,
} from '../types/models/complaint.model';
import {
  ICompany,
  IEducation,
  IResume,
  ISkills,
  IVacancy,
  IWorkExperience,
} from '../const/validations';
import ky, { KyInstance, KyResponse } from 'ky';
import { SearchHistoryModel, SearchType } from '../types/models/searchHistory';
import { FilterModel } from '../types/models/filter';
import { getAuth } from '@web/app/api/auth/[...nextauth]/route';

export class BackendAPI {
  public ky: KyInstance;

  constructor(ky: KyInstance = $api) {
    this.ky = ky;
  }

  async getMe(): Promise<UserModel> {
    const response: UserModel = await this.ky.get('users/me').json();
    return response;
  }

  async updateUserEmail(email: string, password: string): Promise<UserModel> {
    const response: UserModel = await this.ky
      .patch(`auth/email/update`, {
        json: {
          email,
          password,
        },
      })
      .json();
    return response;
  }

  async updateUserPassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<UserModel> {
    const response: UserModel = await this.ky
      .patch(`auth/password/update`, {
        json: {
          oldPassword,
          newPassword,
        },
      })
      .json();
    return response;
  }

  async recoverUserPasswordByEmail(
    email: string,
    role?: Roles | null,
  ): Promise<boolean> {
    const response: boolean = await this.ky
      .post(`auth/password/recover/email`, {
        json: {
          email,
          role,
        },
      })
      .json();
    return response;
  }

  async checkEmailValidationCode(
    emailValidationCode: string,
  ): Promise<ValidationResponse> {
    const response: ValidationResponse = await this.ky
      .post(`users/verify/email`, {
        json: { emailValidationCode },
      })
      .json();
    return response;
  }

  async sendEmailValidationCode(): Promise<{
    emailValidationCodeSentAt: Date;
  }> {
    const response: { emailValidationCodeSentAt: Date } = await this.ky
      .post(`auth/send/emailValidationCode`)
      .json();
    return response;
  }

  async getAllUsers(): Promise<UserModel[]> {
    const response: UserModel[] = await this.ky.get(`users/all`).json();
    return response;
  }

  async getUsersReactionsCounts(
    model: 'vacancy' | 'resume',
  ): Promise<UserReactionsCounts> {
    const response: UserReactionsCounts = await this.ky
      .get(`users/reactions/counts/?model=${model}`)
      .json();
    return response;
  }

  async getBannedUsers(): Promise<UserModel[]> {
    const response: UserModel[] = await this.ky.get(`users/banned`).json();
    return response;
  }

  async banUser(id: number, banReason?: string | null): Promise<boolean> {
    const response: boolean = await this.ky
      .patch(`users/ban`, {
        json: {
          id,
          banReason,
        },
      })
      .json();
    return response;
  }

  async unbanUser(id: number): Promise<boolean> {
    const response: boolean = await this.ky
      .patch(`users/unban`, { json: { id } })
      .json();
    return response;
  }

  // Education
  async upsertEducation(
    resumeId: number,
    values: IEducation,
  ): Promise<KyResponse> {
    return this.ky.post('education', {
      json: {
        resumeId,
        educations: values.educations.map((item) => {
          const id = item.itemId;
          delete item.itemId;
          return {
            ...item,
            id,
            startDate: item.startDate.toISOString(),
            endDate: item.endDate.toISOString(),
            educationOrganization: {
              ...item.educationOrganization,
              type: item.educationOrganization?.educationOrganizationType,
            },
          };
        }),
      },
    });
  }

  async deleteEducation(data: number[]): Promise<boolean> {
    const response: KyResponse = await this.ky.delete('education', {
      json: {
        data,
      },
    });
    return response.ok;
  }

  async getEducationOrganizations(): Promise<EducationOrganizationModel[]> {
    const response: EducationOrganizationModel[] = await this.ky
      .get('educationOrganization')
      .json();
    return response;
  }

  // WorkExperience
  async upsertWorkExperience(
    resumeId: number,
    values: IWorkExperience,
  ): Promise<KyResponse> {
    return this.ky.post('workExperience', {
      json: {
        resumeId,
        workExperiences: values.workExperiences.map((item) => {
          const id = item.itemId;
          delete item.itemId;
          return {
            ...item,
            id,
            startDate: item.startDate.toISOString(),
            endDate: item.endDate.toISOString(),
          };
        }),
      },
    });
  }

  async deleteWorkExperiences(workExperienceIds: number[]): Promise<boolean> {
    const response: KyResponse = await this.ky.delete('workExperience', {
      json: {
        data: workExperienceIds,
      },
    });
    return response.ok;
  }

  async isCompanyInWorkExperience(companyId: number): Promise<boolean> {
    const response: boolean = await this.ky
      .get(`workExperience/check/company/?companyId=${companyId}`)
      .json();
    return response;
  }

  // Company
  async getCompanies(): Promise<CompanyModel[]> {
    const response: CompanyModel[] = await this.ky.get('company/all').json();
    return response;
  }

  async getBestCompanies(): Promise<CompanyModel[]> {
    const response: CompanyModel[] = await this.ky
      .get('company/recommendations')
      .json();
    return response;
  }

  async getCompany(id: number): Promise<CompanyModel> {
    const response: CompanyModel = await this.ky
      .get(`company/?id=${id}`)
      .json();
    return response;
  }

  async getVacancyCompany(id: number): Promise<CompanyModel> {
    const response: CompanyModel = await this.ky
      .get(`company/vacancy/?id=${id}`)
      .json();
    return response;
  }

  async getCompanyRatings(id: number): Promise<CompanyRatingsModel[]> {
    const response: CompanyRatingsModel[] = await this.ky
      .get(`company/ratings/?id=${id}`)
      .json();
    return response;
  }

  async getCompanyBenefits(id: number): Promise<BenefitModel[]> {
    const response: BenefitModel[] = await this.ky
      .get(`company/benefits/?id=${id}`)
      .json();
    return response;
  }

  async getCompanyRatingBenefits(
    userId: number,
    companyId: number,
  ): Promise<BenefitModel[]> {
    const response: BenefitModel[] = await this.ky
      .get(`company/rating/benefits/?userId=${userId}&companyId=${companyId}`)
      .json();
    return response;
  }

  async ratingCompany(
    data: Omit<CompanyRatingsModel, 'id' | 'userId'>,
  ): Promise<CompanyRatingsModel> {
    const response: CompanyRatingsModel = await this.ky
      .post('company/rating', {
        json: { data },
      })
      .json();
    return response;
  }

  async deleteMyCompanyRating(id: number): Promise<CompanyModel> {
    const response: CompanyModel = await this.ky
      .delete('company/rating', {
        json: {
          data: { id },
        },
      })
      .json();
    return response;
  }

  async addCompanyOwner(
    companyId: number,
    userId: number,
  ): Promise<CompanyModel> {
    const response: CompanyModel = await this.ky
      .post('company/add/owner', {
        json: { companyId, userId },
      })
      .json();
    return response;
  }

  async getCompanyVacancies(id: number): Promise<VacancyModel[]> {
    const response: VacancyModel[] = await this.ky
      .get(`vacancy/company/?companyId=${id}`)
      .json();
    return response;
  }

  async upsertVacancyCompany(
    vacancyId: number,
    company: ICompany,
  ): Promise<CompanyModel> {
    company.industries = company?.industries
      ?.filter((item: any) => !!item.title)
      .map((item: any) => {
        const id = item.itemId;
        delete item.itemId;
        return {
          ...item,
          id,
        };
      });

    const response: CompanyModel = await this.ky
      .post('vacancy/company', {
        json: {
          company,
          vacancyId,
        },
      })
      .json();

    if (company.image && response?.id) {
      await this.upsertCompanyImage(response.id, company.image);
    }

    return response;
  }

  async upsertCompanyImage(companyId: number, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('id', JSON.stringify(companyId));
    const response: KyResponse = await this.ky.post('company/image', {
      body: formData,
    });
    return response.ok;
  }

  async upsertCompany({ image, ...values }: ICompany, id?: number) {
    const response: CompanyModel = await this.ky
      .post('company', {
        json: {
          ...values,
          id,
        },
      })
      .json();

    if (image && response?.id) {
      await this.upsertCompanyImage(response.id, image);
    }

    return response;
  }

  async deleteCompanyImage(id: number, imageName?: string) {
    const response: KyResponse = await this.ky.delete('company/image', {
      json: { data: { id, imageName } },
    });
    return response.ok;
  }

  // Skills
  async upsertSkills(
    entityId: number,
    entityType: 'resume' | 'vacancy',
    values: ISkills,
  ): Promise<AxiosResponse | void> {
    const newSkills = values.skills
      ?.filter((item) => !!item.title)
      .map((item) => {
        const id = item.itemId;
        delete item.itemId;
        return {
          ...item,
          id,
          // type: item.skillType,
        };
      });

    if (entityType === 'resume')
      return this.ky
        .post('resume/skills', {
          json: {
            id: entityId,
            skills: newSkills,
          },
        })
        .json();

    if (entityType === 'vacancy')
      return this.ky
        .post('vacancy/skills', {
          json: {
            id: entityId,
            skills: newSkills,
          },
        })
        .json();
  }

  async getSkills(): Promise<SkillModel[]> {
    const response: SkillModel[] = await this.ky.get('skill').json();
    return response;
  }

  // async deleteSkills(skillIds: number[]): Promise<boolean> {
  //     const response: AxiosResponse = await this.ky.delete("/resume/skills", {
  //         data: skillIds,
  //     })
  //     return !!response || false
  // }

  // Vacancies
  async getVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .get(`vacancy/?id=${id}`)
      .json();
    return response;
  }

  async getMyVacancies(): Promise<VacancyModel[]> {
    const response: VacancyModel[] = await this.ky.get('vacancy/my').json();
    return response;
  }

  async getVacancies(userId: number): Promise<VacancyModel[]> {
    const response: VacancyModel[] = await this.ky
      .get(`vacancy/user/?userId=${userId}`)
      .json();
    return response;
  }

  async getPaginatedVacancies(params: {
    page?: number;
    pageSize?: number;
    userId?: number;
  }): Promise<PaginatedResponse<VacancyModel>> {
    if (!params.page) {
      params.page = 1;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    const response: PaginatedResponse<VacancyModel> = await this.ky
      .get(`vacancy/list`, {
        searchParams: QueryString.stringify(params, { arrayFormat: 'repeat' }),
      })
      .json();
    return response;
  }

  async getRecommendationsVacancies(): Promise<VacancyModel[]> {
    const response: VacancyModel[] = await this.ky
      .get('vacancy/recommendations')
      .json();
    return response;
  }

  async upsertVacancy(
    vacancy: IVacancy,
    type: 'create' | 'update',
  ): Promise<VacancyModel> {
    vacancy.languages = vacancy.languages
      ?.filter((item) => !!item.title)
      .map((item) => {
        return {
          ...item,
          level: item.LanguageVacancy?.level,
          proficiency: item.LanguageVacancy?.proficiency,
        };
      });

    vacancy.benefits = vacancy.benefits
      ?.filter((item) => !!item.title)
      .map((item) => {
        // const id = item.itemId
        // delete item.itemId
        return {
          ...item,
          // id,
        };
      });

    let response: VacancyModel;
    if (type === 'create')
      response = await this.ky.post('vacancy', { json: { vacancy } }).json();
    else if (type === 'update')
      response = await this.ky.patch('vacancy', { json: { vacancy } }).json();
    else throw new Error(`Wrong upsert type provided: ${type}`);

    if (vacancy.image && response?.id) {
      const formData = new FormData();
      formData.append('image', vacancy.image);
      formData.append('id', JSON.stringify(response.id));
      await this.ky.post('vacancy/image', { body: formData });
    }

    return response;
  }

  async deleteVacancyImage(id: number, imageName?: string) {
    const response: KyResponse = await this.ky.delete('vacancy/image', {
      json: { data: { id, imageName } },
    });
    return response.ok;
  }

  async deleteVacancy(id: number) {
    const response: KyResponse = await this.ky.delete('vacancy', {
      json: { data: { id } },
    });
    return response.ok;
  }

  async activateVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/activate', { json: { id } })
      .json();
    return response;
  }

  async deactivateVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/deactivate', { json: { id } })
      .json();
    return response;
  }

  async deleteVacancyIndustries(
    vacancyId: number,
    industryIds: number[],
  ): Promise<boolean> {
    const response: KyResponse = await this.ky.delete('vacancy/industries', {
      json: { data: { vacancyId, industryIds } },
    });
    return response.ok;
  }

  async likeVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/like', { json: { id } })
      .json();
    return response;
  }

  async unlikeVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/unlike', { json: { id } })
      .json();
    return response;
  }

  async likeVacancyComment(id: number): Promise<VacancyCommentModel> {
    const response: VacancyCommentModel = await this.ky
      .post('vacancy/comment/like', { json: { id } })
      .json();
    return response;
  }

  async unlikeVacancyComment(id: number): Promise<VacancyCommentModel> {
    const response: VacancyCommentModel = await this.ky
      .post('vacancy/comment/unlike', { json: { id } })
      .json();
    return response;
  }

  async viewVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/view', { json: { id } })
      .json();
    return response;
  }

  async respondVacancy(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/respond', { json: { id } })
      .json();
    return response;
  }

  async setVacancyComplaint(
    id: number,
    description?: string | null,
  ): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('vacancy/complaint', { json: { id, description } })
      .json();
    return response;
  }

  async getVacancyComplaints(): Promise<VacancyComplaintModel[]> {
    const response: VacancyComplaintModel[] = await this.ky
      .get('vacancy/complaints')
      .json();
    return response;
  }

  async banVacancies(
    userId: number,
    banReason?: string | null,
  ): Promise<boolean> {
    const response = await this.ky.patch('vacancy/ban/all', {
      json: {
        userId,
        banReason,
      },
    });
    return response.ok;
  }

  async banVacancy(
    id: number,
    userId?: number,
    banReason?: string | null,
  ): Promise<boolean> {
    const response = await this.ky.patch('vacancy/ban', {
      json: {
        id,
        userId,
        banReason,
      },
    });
    return response.ok;
  }

  async createVacancyComment(
    vacancyId: number,
    message: string,
  ): Promise<VacancyCommentModel> {
    const response: VacancyCommentModel = await this.ky
      .post('vacancy/comment', { json: { id: vacancyId, message } })
      .json();
    return response;
  }

  async updateVacancyComment(
    commentId: number,
    message: string,
  ): Promise<VacancyCommentModel> {
    const response: VacancyCommentModel = await this.ky
      .patch('vacancy/comment', { json: { id: commentId, message } })
      .json();
    return response;
  }

  async deleteVacancyComment(commentId: number): Promise<boolean> {
    const response: KyResponse = await this.ky
      .delete('vacancy/comment', {
        json: { data: { id: commentId } },
      })
      .json();
    return response.ok;
  }

  async setReactionViewedToVacancy(
    reactionType: string,
    id: number,
    userId: number,
  ): Promise<any> {
    const response: ContactsModel = await this.ky
      .post('vacancy/reaction/viewed', {
        json: {
          reactionType,
          id,
          userId,
        },
      })
      .json();
    return response;
  }

  async deleteVacancyFiles() {
    const response: AxiosResponse = await this.ky
      .delete('vacancy/files')
      .json();
    return !!response || false;
  }

  // benefits
  async getBenefits(): Promise<BenefitModel[]> {
    const response: BenefitModel[] = await this.ky.get('benefits').json();
    return response;
  }

  async deleteVacancyBenefits(
    vacancyId: number,
    benefitIds: number[],
  ): Promise<boolean> {
    const response: KyResponse = await this.ky.delete('benefits/vacancy', {
      json: {
        data: { vacancyId, benefitIds },
      },
    });
    return response.ok;
  }

  async deleteCompanyRatingBenefits(
    companyRatingId: number,
    benefitIds: number[],
  ): Promise<boolean> {
    const response: KyResponse = await this.ky.delete(
      'benefits/company/rating',
      {
        json: {
          data: { companyRatingId, benefitIds },
        },
      },
    );
    return response.ok;
  }

  // Resume
  async getResume(id: number): Promise<ResumeModel> {
    const response: ResumeModel = await this.ky.get(`resume/?id=${id}`).json();
    return response;
  }

  async getMyResume(): Promise<ResumeModel[]> {
    const response: ResumeModel[] = await this.ky.get('resume/my').json();
    return response;
  }

  async getPaginatedResume(
    page: number,
    pageSize = 10,
    query?: string,
  ): Promise<PaginatedResponse<ResumeModel>> {
    // if (!params.page) {
    //   params.page = 1;
    // }
    // if (!params.pageSize) {
    //   params.pageSize = 10;
    // }
    const response: PaginatedResponse<ResumeModel> = await this.ky
      .get(`resume/list/?page=${page}&pageSize=${pageSize}${query}`)
      .json();
    return response;
  }

  async upsertResume(resume: IResume): Promise<ResumeModel> {
    resume.languages = resume.languages
      ?.filter((item: any) => !!item.title)
      .map((item) => {
        return {
          ...item,
          level: item.LanguageResume?.level,
          proficiency: item.LanguageResume?.proficiency,
        };
      });

    resume.industries = resume.industries
      ?.filter((item) => !!item.title)
      .map((item) => {
        const id = item.itemId;
        delete item.itemId;
        return {
          ...item,
          id,
        };
      });

    const response: ResumeModel = await this.ky
      .post('resume', { json: resume })
      .json();

    if (resume.image && response?.id) {
      const formData = new FormData();
      formData.append('image', resume.image);
      formData.append('id', JSON.stringify(response.id));
      await this.ky.post('resume/image', { body: formData });
    }

    return response;
  }

  async deleteResumeImage(id: number, imageName?: string) {
    const response: AxiosResponse = await this.ky
      .delete('resume/image', {
        json: { data: { id, imageName } },
      })
      .json();
    return !!response || false;
  }

  async deleteResume(id: number) {
    const response: AxiosResponse = await this.ky
      .delete('resume', {
        json: { data: { id } },
      })
      .json();
    return !!response || false;
  }

  async activateResume(id: number): Promise<ResumeModel> {
    const response: ResumeModel = await this.ky
      .post('resume/activate', { json: { id } })
      .json();
    return response;
  }

  async deactivateResume(id: number): Promise<ResumeModel> {
    const response: ResumeModel = await this.ky
      .post('resume/deactivate', { json: { id } })
      .json();
    return response;
  }

  async likeResume(id: number): Promise<ResumeModel> {
    const response: ResumeModel = await this.ky
      .post('resume/like', { json: { id } })
      .json();
    return response;
  }

  async unlikeResume(id: number): Promise<ResumeModel> {
    const response: ResumeModel = await this.ky
      .post('resume/unlike', { json: { id } })
      .json();
    return response;
  }

  async likeResumeComment(id: number): Promise<ResumeCommentModel> {
    const response: ResumeCommentModel = await this.ky
      .post('resume/comment/like', { json: { id } })
      .json();
    return response;
  }

  async unlikeResumeComment(id: number): Promise<ResumeCommentModel> {
    const response: ResumeCommentModel = await this.ky
      .post('resume/comment/unlike', { json: { id } })
      .json();
    return response;
  }

  async viewResume(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('resume/view', { json: { id } })
      .json();
    return response;
  }

  async respondResume(id: number): Promise<VacancyModel> {
    const response: VacancyModel = await this.ky
      .post('resume/respond', { json: { id } })
      .json();
    return response;
  }

  async setResumeComplaint(
    id: number,
    description?: string | null,
  ): Promise<ResumeModel> {
    const response: ResumeModel = await this.ky
      .post('resume/complaint', { json: { id, description } })
      .json();
    return response;
  }

  async getResumeComplaints(): Promise<ResumeComplaintModel[]> {
    const response: ResumeComplaintModel[] = await this.ky
      .get('resume/complaints')
      .json();
    return response;
  }

  async banResume(userId: number, banReason?: string | null): Promise<boolean> {
    const response = await this.ky.patch('resume/ban/all', {
      json: {
        userId,
        banReason,
      },
    });
    return response.ok;
  }

  async banOneResume(
    id: number,
    userId?: number,
    banReason?: string | null,
  ): Promise<boolean> {
    const response = await this.ky.patch('resume/ban', {
      json: {
        id,
        userId,
        banReason,
      },
    });
    return response.ok;
  }

  async createResumeComment(
    resumeId: number,
    message: string,
  ): Promise<ResumeCommentModel> {
    const response: ResumeCommentModel = await this.ky
      .post('resume/comment', { json: { id: resumeId, message } })
      .json();
    return response;
  }

  async updateResumeComment(
    commentId: number,
    message: string,
  ): Promise<ResumeCommentModel> {
    const response: ResumeCommentModel = await this.ky
      .patch('resume/comment', { json: { id: commentId, message } })
      .json();
    return response;
  }

  async deleteResumeComment(commentId: number): Promise<any> {
    const response: any = await this.ky
      .delete('resume/comment', {
        json: { data: { id: commentId } },
      })
      .json();
    return response;
  }

  async setReactionViewedToResume(
    reactionType: string,
    id: number,
    userId: number,
  ): Promise<ContactsModel> {
    const response: ContactsModel = await this.ky
      .post('resume/reaction/viewed', {
        json: {
          reactionType,
          id,
          userId,
        },
      })
      .json();
    return response;
  }

  async deleteResumeFiles() {
    const response: KyResponse = await this.ky.delete('resume/files');
    return !!response || false;
  }

  // contacts
  async upsertContacts(contacts: ContactsModel): Promise<ContactsModel> {
    const response: ContactsModel = await this.ky
      .post('contacts', { json: contacts })
      .json();
    return response;
  }

  async getResumeContacts(id: number): Promise<ContactsModel> {
    const response: ContactsModel = await this.ky
      .get(`contacts/resume/?id=${id}`)
      .json();
    return response;
  }

  async getVacancyContacts(id: number): Promise<ContactsModel> {
    const response: ContactsModel = await this.ky
      .get(`contacts/vacancy/?id=${id}`)
      .json();
    return response;
  }

  async getUserContacts(id: number): Promise<ContactsModel> {
    const response: ContactsModel = await this.ky
      .get(`contacts/user/?id=${id}`)
      .json();
    return response;
  }

  // categories
  async getCategories(): Promise<CategoryModel[]> {
    const response: CategoryModel[] = await this.ky.get('category').json();
    return response;
  }

  // industries
  async getIndustries(): Promise<IndustryModel[]> {
    const response: IndustryModel[] = await this.ky.get('industry').json();
    return response;
  }

  // cities
  async getCities(): Promise<CityModel[]> {
    const response: CityModel[] = await this.ky.get('city').json();
    return response;
  }

  // languages
  async getLanguages(): Promise<LanguageModel[]> {
    const response: LanguageModel[] = await this.ky.get('language').json();
    return response;
  }

  // citizenships
  async getCitizenships(): Promise<CitizenshipModel[]> {
    const response: CitizenshipModel[] = await this.ky
      .get('citizenship')
      .json();
    return response;
  }

  // searchHistory
  async getSearchHistoryRecommendations(
    searchType: SearchType,
    includeText = '',
  ): Promise<SearchHistoryModel[]> {
    const response: SearchHistoryModel[] = await this.ky
      .get(
        `searchHistory/recommendations/?includeText=${includeText}&searchType=${searchType}`,
      )
      .json();
    return response;
  }

  async deleteMySearchHistory(historyId: number): Promise<any> {
    const response = await this.ky.delete(`searchHistory`, {
      json: { id: historyId },
    });
    return response;
  }

  // filter
  async upsertFilter(values: FilterModel) {
    const response: FilterModel = await this.ky
      .post('filter', {
        json: values,
      })
      .json();

    return response;
  }

  async getMyFilters(): Promise<FilterModel[]> {
    const response: FilterModel[] = await this.ky.get(`filter/my`).json();
    return response;
  }

  async deleteMyFilter(filterId: number): Promise<any> {
    const response = await this.ky.delete(`filter`, { json: { id: filterId } });
    return response;
  }
}

export const backendApiInstance = new BackendAPI();

export const getBackendApiSSR = async (useAuth: boolean) => {
  const session = useAuth && (await getAuth());
  //@ts-ignore
  const token = session?.apiTokens.accessToken;
  if (token) {
    return {
      api: new BackendAPI(
        $api.extend({
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
      session,
    };
  }
  return { api: backendApiInstance, session };
};
