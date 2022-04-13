export interface User {
  _key: string;
  userAvatar?: string;
  userName?: string;
  email?: string;
  mobile?: string;
  config?: {
    locale: "zh" | "en";
    dark: boolean;
    theme: string;
  };
}
export interface Group {
  _key: string;
  avatar: string;
  title: string;
  memberCount?: number;
  receiverType?: string;
  toUserKey?: string | null;
  checked?: boolean;
}
export interface Member extends User {
  role: number;
}
