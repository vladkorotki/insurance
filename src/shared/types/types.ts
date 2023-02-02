export type RoleData = {
  login:string;
  name: string;
  file:any;
  countryCode?: string;
  email: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  phone?: string;
  lastName?: string;
  admin?: string;
  employer?: string;
};

export type DataReq = {
  login:string
  userName: string;
  password: string;
  role: "admin" | "employer" | "consumer";
  data: RoleData;
};

export type IPlans = {
  name: string;
  type: string;
  contributions: number;
  startDate?: Date;
  endDate?: Date;
  friquence?: number;
};

export type IClaims = {
  consumerId: string;
  employer: string;
  date?: Date;
  plan?: string;
  phone?:string
  amount?: string;
  status?: string;
};


