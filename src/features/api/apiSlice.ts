import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import type {
  HomeProfile, AboutResponse, Achievement, SkillCategory,
  Experience, ExperienceProject, Project, Certification,
  ContactInfo, ContactMessage, SiteSettings,
} from '../../types';

// In dev, Vite proxies /api to `vercel dev` (see vite.config.ts). In prod on
// Vercel, /api is served by the same deployment, so a relative path works everywhere.
const BASE_URL = '/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Home', 'About', 'Achievements', 'Skills', 'Experience', 'Projects', 'Certifications', 'ContactInfo', 'Messages', 'Settings'],
  endpoints: (builder) => ({
    // ---------------- Auth ----------------
    login: builder.mutation<{ token: string; username: string }, { username: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    // ---------------- Home ----------------
    getHome: builder.query<HomeProfile, void>({
      query: () => '/home',
      providesTags: ['Home'],
    }),
    updateHome: builder.mutation<HomeProfile, Partial<HomeProfile>>({
      query: (body) => ({ url: '/home', method: 'PUT', body }),
      invalidatesTags: ['Home'],
    }),

    // ---------------- About ----------------
    getAbout: builder.query<AboutResponse, void>({
      query: () => '/about',
      providesTags: ['About', 'Achievements'],
    }),
    updateAbout: builder.mutation<AboutResponse['about'], { passion_title?: string; passion_text?: string; journey_text?: string; years_experience?: string; technologies_count?: string }>({
      query: (body) => ({ url: '/about', method: 'PUT', body }),
      invalidatesTags: ['About'],
    }),
    addAchievement: builder.mutation<Achievement, Partial<Achievement>>({
      query: (body) => ({ url: '/achievements', method: 'POST', body }),
      invalidatesTags: ['Achievements'],
    }),
    updateAchievement: builder.mutation<Achievement, Partial<Achievement> & { id: number }>({
      query: (body) => ({ url: '/achievements', method: 'PUT', body }),
      invalidatesTags: ['Achievements'],
    }),
    deleteAchievement: builder.mutation<void, number>({
      query: (id) => ({ url: `/achievements?id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Achievements'],
    }),

    // ---------------- Skills ----------------
    getSkills: builder.query<SkillCategory[], void>({
      query: () => '/skills',
      providesTags: ['Skills'],
    }),
    addSkillCategory: builder.mutation<SkillCategory, { name: string; sort_order?: number }>({
      query: (body) => ({ url: '/skills', method: 'POST', body: { entity: 'category', ...body } }),
      invalidatesTags: ['Skills'],
    }),
    updateSkillCategory: builder.mutation<SkillCategory, { id: number; name?: string; sort_order?: number }>({
      query: (body) => ({ url: '/skills', method: 'PUT', body: { entity: 'category', ...body } }),
      invalidatesTags: ['Skills'],
    }),
    deleteSkillCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/skills?entity=category&id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Skills'],
    }),
    addSkill: builder.mutation<void, { category_id: number; name: string; proficiency?: number; sort_order?: number }>({
      query: (body) => ({ url: '/skills', method: 'POST', body: { entity: 'skill', ...body } }),
      invalidatesTags: ['Skills'],
    }),
    updateSkill: builder.mutation<void, { id: number; name?: string; proficiency?: number; sort_order?: number; category_id?: number }>({
      query: (body) => ({ url: '/skills', method: 'PUT', body: { entity: 'skill', ...body } }),
      invalidatesTags: ['Skills'],
    }),
    deleteSkill: builder.mutation<void, number>({
      query: (id) => ({ url: `/skills?entity=skill&id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Skills'],
    }),

    // ---------------- Experience ----------------
    getExperience: builder.query<Experience[], void>({
      query: () => '/experience',
      providesTags: ['Experience'],
    }),
    addExperienceCompany: builder.mutation<Experience, Partial<Experience>>({
      query: (body) => ({ url: '/experience', method: 'POST', body: { entity: 'company', ...body } }),
      invalidatesTags: ['Experience'],
    }),
    updateExperienceCompany: builder.mutation<Experience, Partial<Experience> & { id: number }>({
      query: (body) => ({ url: '/experience', method: 'PUT', body: { entity: 'company', ...body } }),
      invalidatesTags: ['Experience'],
    }),
    deleteExperienceCompany: builder.mutation<void, number>({
      query: (id) => ({ url: `/experience?entity=company&id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Experience'],
    }),
    addExperienceProject: builder.mutation<ExperienceProject, Partial<ExperienceProject>>({
      query: (body) => ({ url: '/experience', method: 'POST', body: { entity: 'project', ...body } }),
      invalidatesTags: ['Experience'],
    }),
    updateExperienceProject: builder.mutation<ExperienceProject, Partial<ExperienceProject> & { id: number }>({
      query: (body) => ({ url: '/experience', method: 'PUT', body: { entity: 'project', ...body } }),
      invalidatesTags: ['Experience'],
    }),
    deleteExperienceProject: builder.mutation<void, number>({
      query: (id) => ({ url: `/experience?entity=project&id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Experience'],
    }),

    // ---------------- Projects ----------------
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      providesTags: ['Projects'],
    }),
    addProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation<Project, Partial<Project> & { id: number }>({
      query: (body) => ({ url: '/projects', method: 'PUT', body }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({ url: `/projects?id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Projects'],
    }),

    // ---------------- Certifications ----------------
    getCertifications: builder.query<Certification[], void>({
      query: () => '/certifications',
      providesTags: ['Certifications'],
    }),
    addCertification: builder.mutation<Certification, Partial<Certification>>({
      query: (body) => ({ url: '/certifications', method: 'POST', body }),
      invalidatesTags: ['Certifications'],
    }),
    updateCertification: builder.mutation<Certification, Partial<Certification> & { id: number }>({
      query: (body) => ({ url: '/certifications', method: 'PUT', body }),
      invalidatesTags: ['Certifications'],
    }),
    deleteCertification: builder.mutation<void, number>({
      query: (id) => ({ url: `/certifications?id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Certifications'],
    }),

    // ---------------- Contact ----------------
    getContactInfo: builder.query<ContactInfo, void>({
      query: () => '/contact-info',
      providesTags: ['ContactInfo'],
    }),
    updateContactInfo: builder.mutation<ContactInfo, Partial<ContactInfo>>({
      query: (body) => ({ url: '/contact-info', method: 'PUT', body }),
      invalidatesTags: ['ContactInfo'],
    }),
    sendContactMessage: builder.mutation<ContactMessage, { name: string; email: string; subject: string; message: string }>({
      query: (body) => ({ url: '/contact-messages', method: 'POST', body }),
    }),
    getContactMessages: builder.query<ContactMessage[], void>({
      query: () => '/contact-messages',
      providesTags: ['Messages'],
    }),

    // ---------------- Settings ----------------
    getSettings: builder.query<SiteSettings, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
      query: (body) => ({ url: '/settings', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetHomeQuery, useUpdateHomeMutation,
  useGetAboutQuery, useUpdateAboutMutation,
  useAddAchievementMutation, useUpdateAchievementMutation, useDeleteAchievementMutation,
  useGetSkillsQuery, useAddSkillCategoryMutation, useUpdateSkillCategoryMutation, useDeleteSkillCategoryMutation,
  useAddSkillMutation, useUpdateSkillMutation, useDeleteSkillMutation,
  useGetExperienceQuery, useAddExperienceCompanyMutation, useUpdateExperienceCompanyMutation, useDeleteExperienceCompanyMutation,
  useAddExperienceProjectMutation, useUpdateExperienceProjectMutation, useDeleteExperienceProjectMutation,
  useGetProjectsQuery, useAddProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation,
  useGetCertificationsQuery, useAddCertificationMutation, useUpdateCertificationMutation, useDeleteCertificationMutation,
  useGetContactInfoQuery, useUpdateContactInfoMutation, useSendContactMessageMutation, useGetContactMessagesQuery,
  useGetSettingsQuery, useUpdateSettingsMutation,
} = api;
