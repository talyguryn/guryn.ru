export type LeafletSection = {
  title: LeafletTextfield;
  content: LeafletTextfield;
};

export type LeafletTextfield = {
  value?: string;
  placeholder?: string;
};

export type SkillsInfo = {
  direction: LeafletTextfield;
  skillsList: LeafletTextfield;
};

export type JobInfo = {
  duration: LeafletTextfield;
  position: LeafletTextfield;
  keySkills: LeafletTextfield;
  company: LeafletTextfield;
  companySite: LeafletTextfield;
  description: LeafletTextfield;
};

export type EducationInfo = {
  duration: LeafletTextfield;
  place: LeafletTextfield;
  description: LeafletTextfield;
};

export type LeafletData = {
  name: LeafletTextfield;
  imageSrc?: string;
  profession: LeafletTextfield;
  professionSkills: LeafletTextfield;

  contacts: LeafletTextfield[];
  city: LeafletTextfield;

  overview?: LeafletTextfield;
  skills?: SkillsInfo[];
  experience?: JobInfo[];

  education?: EducationInfo[];

  additionalSkills?: SkillsInfo[];


  /** remove later */
  sections: LeafletSection[];
  asideSection: LeafletSection[];
};
