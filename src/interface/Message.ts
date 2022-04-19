import { User } from "./User";

export interface Message {
  _key: string;
  cover: null | string;
  creatorInfo: User;
  hasRead: number;
  receiverKey: string;
  receiverTitle: null | string;
  receiverType: string;
  summary: string;
  type?: string;
  title: string;
  refCardInfo?: any;
}
export interface Card {
  _key?: string;
  detail: any;
  favorite: boolean;
  receiverInfo?: any;
  replyList?: any;
  creatorInfo?: {
    userAvatar: string;
    userName: string;
    _key: string;
  };
}
export interface Reply {
  cardKey: string;
  content:string;
  createTime: number;
  userAvatar: string;
  userKey:string;
  userName: string;
  _key: string;
}
