interface PersonReference {
  name: string;
  role: string;
  initials: string;
}

export interface ProfileDocument {
  id: string;
  name: string;
  category: string;
  updatedAt: string;
  status: "signed" | "current";
  isRestricted: boolean;
}

export const profileValueLabelKeys: Record<string, string> = {
  active: "profile.profileValueEngagementActive",
  Active: "profile.profileValueEngagementActive",
  senior: "profile.profileValueJobLevelSenior",
  jobTitleSoftwareEngineer: "profile.profileValueJobTitleSoftwareEngineer",
  headOfProduct: "profile.profileValueManagerRoleHeadOfProduct",
  contractor: "profile.profileValueEmploymentContractor",
  remote: "profile.profileValueWorkplaceRemote",
  heHim: "profile.profileValuePronounsHeHim",
  monFri: "profile.profileValueScheduleMonFri",
  hours40: "profile.profileValueHours40",
  days30: "profile.profileValueDays30",
  years4Months4: "profile.profileValueYears4Months4",
  days25: "profile.profileValueDays25",
  days18: "profile.profileValueDays18",
  days0: "profile.profileValueDays0",
  days7: "profile.profileValueDays7",
  days5: "profile.profileValueDays5",
  dateAug24To28_2026: "profile.profileValueAug24To28",
  dateOct3_2026: "profile.profileValueOct32026",
  dateJan1ToDec31_2026: "profile.profileValueJan1ToDec31",
  dateAug8_2026: "profile.profileValueAug82026",
  dateMar18_2022: "profile.profileValueMar182022",
  dateSep9_1993: "profile.profileValueSep91993",
  contractLeaveAllowance: "profile.profileValueLeavePolicy",
  ammarBrother: "profile.profileValueEmergencyContact",
  contract: "profile.profileValueDocCategoryContract",
  compliance: "profile.profileValueDocCategoryCompliance",
  policy: "profile.profileValueDocCategoryPolicy",
  signed: "profile.profileValueDocStatusSigned",
  current: "profile.profileValueDocStatusCurrent",
  dateMar18_2022Short: "profile.profileValueMar182022Short",
  dateJan8_2026Short: "profile.profileValueJan82026Short",
  bioMatheus: "profile.profileValueBio",
  teamProduct: "profile.profileValueTeamProduct",
  departmentProduct: "profile.profileValueDepartmentProduct",
  projectAutonomousBidAgent: "profile.profileValueProjectAutonomousBidAgent",
  docNameContractorAgreement: "profile.profileValueDocNameContractorAgreement",
  docNameConfidentialityAgreement: "profile.profileValueDocNameConfidentialityAgreement",
  docNameInfoSecurityPolicy: "profile.profileValueDocNameInfoSecurityPolicy",
};

export interface ProfileRecord {
  name: string;
  preferredName: string;
  legalName: string;
  pronouns: string;
  initials: string;
  avatar: string;
  engagementStatus: "Active";
  jobTitle: string;
  jobLevel: string;
  department: string;
  team: string;
  currentProject: string;
  workEmail: string;
  personalEmail: string;
  workPhone: string;
  workplace: string;
  timeZone: string;
  contractorId: string;
  startDate: string;
  engagementLength: string;
  employmentType: string;
  weeklyHours: string;
  schedule: string;
  contractingEntity: string;
  noticePeriod: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  manager: PersonReference;
  bio: string;
  leavePolicy: string;
  annualLeaveAllowance: string;
  remainingLeave: string;
  carriedOverLeave: string;
  usedLeave: string;
  scheduledLeave: string;
  pendingLeaveRequests: string;
  leaveYear: string;
  nextLeave: string;
  lastWorkingDay: string;
  updatedBy: string;
  updatedAt: string;
  documents: ProfileDocument[];
}

export const profile: ProfileRecord = {
  name: "Matheus Moraes",
  preferredName: "Matheus",
  legalName: "Matheus Moraes",
  pronouns: "heHim",
  initials: "MM",
  avatar: "https://avatars.githubusercontent.com/u/43849669",
  engagementStatus: "Active",
  jobTitle: "jobTitleSoftwareEngineer",
  jobLevel: "senior",
  department: "departmentProduct",
  team: "teamProduct",
  currentProject: "projectAutonomousBidAgent",
  workEmail: "voce@exemplo.com",
  personalEmail: "arhamkhnz@gmail.com",
  workPhone: "+1 (415) 555-0148",
  workplace: "remote",
  timeZone: "UTC-3:00",
  contractorId: "WS-2301",
  startDate: "dateMar18_2022",
  engagementLength: "years4Months4",
  employmentType: "contractor",
  weeklyHours: "hours40",
  schedule: "monFri",
  contractingEntity: "Studio Technologies Pte. Ltd.",
  noticePeriod: "days30",
  dateOfBirth: "dateSep9_1993",
  address: "1842 Valencia Street, San Francisco, CA 94110",
  emergencyContact: "ammarBrother",
  emergencyPhone: "+1 (510) 555-0177",
  manager: {
    name: "Pravi K.",
    role: "headOfProduct",
    initials: "PK",
  },
  bio: "bioMatheus",
  leavePolicy: "contractLeaveAllowance",
  annualLeaveAllowance: "days25",
  remainingLeave: "days18",
  carriedOverLeave: "days0",
  usedLeave: "days7",
  scheduledLeave: "days5",
  pendingLeaveRequests: "0",
  leaveYear: "dateJan1ToDec31_2026",
  nextLeave: "dateAug24To28_2026",
  lastWorkingDay: "dateOct3_2026",
  updatedBy: "Matheus Moraes",
  updatedAt: "dateAug8_2026",
  documents: [
    {
      id: "doc-1",
      name: "docNameContractorAgreement",
      category: "contract",
      updatedAt: "dateMar18_2022Short",
      status: "signed",
      isRestricted: false,
    },
    {
      id: "doc-2",
      name: "docNameConfidentialityAgreement",
      category: "compliance",
      updatedAt: "dateMar18_2022Short",
      status: "signed",
      isRestricted: true,
    },
    {
      id: "doc-4",
      name: "docNameInfoSecurityPolicy",
      category: "policy",
      updatedAt: "dateJan8_2026Short",
      status: "current",
      isRestricted: false,
    },
  ],
};
