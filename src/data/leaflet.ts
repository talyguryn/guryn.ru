import { LeafletData } from '@/types/leaflet';

export const defaultLeafletData: LeafletData = {
  name: { value: '', placeholder: 'Имя и фамилия' },

  profession: { value: '', placeholder: 'Желаемая должность' },
  professionSkills: {
    value: '',
    placeholder: 'Основные навыки',
  },
  contacts: [
    { value: '', placeholder: 'E-mail' },
    { value: '', placeholder: 'Телефон' },
    { value: '', placeholder: 'Telegram' },
    { value: '', placeholder: 'GitHub' },
  ],
  city: { value: '', placeholder: 'Ваш город' },
  overview: {
    value:
      '',
    placeholder: 'Краткий обзор ваших профессиональных качеств',
  },
  skills: [
    {
      direction: { value: '', placeholder: 'Направление' },
      skillsList: {
        value: '',
        placeholder: 'Список навыков через запятую',
      },
    },
  ],
  experience: [],
  education: [],
  additionalSkills: [],


  /** remove later */
  sections: [],
  asideSection: [],
};
