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
  favoriteMessageCount?: number;
  privateMessageCount?: number;
  sentMessageCount?: number;
}
export interface Group {
  _key: string;
  avatar: string;
  title: string;
  memberCount?: number;
  receiverType?: string;
  toUserKey?: string | null;
  checked?: boolean;
  email?: boolean;
  mute?: boolean;
  block?: boolean;
}
export interface Member extends User {
  role: number;
}
export interface Mate extends User {
  receiverKey?: string;
}
export interface Search {
  _key?: string;
  toUserKey?: string;
  avatar: string;
  title: string;
  allowJoin?: boolean;
  hasApply?: boolean;
}
