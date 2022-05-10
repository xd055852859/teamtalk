import { Card } from "./Message";

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
  boardNum?: number;
  topicNum?: number;
  replyNum?: number;
}
export interface Search {
  _key?: string;
  toUserKey?: string;
  avatar: string;
  title: string;
  allowJoin?: boolean;
  hasApply?: boolean;
}
export interface BoardObj{
  _key: string;
  avatar: string;
  block: boolean | null;
  memberCount: 3;
  moderator: Member[];
  mute: boolean | null;
  newestCard: Card;
  receiverType: string;
  title: string;
  toUserKey: null;
  unReadNum: 5;
  role?: number;
  allowJoin?:boolean;
  followerCount?:boolean;
  cardNum?:boolean;
}
