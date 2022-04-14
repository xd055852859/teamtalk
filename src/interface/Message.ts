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
}
export interface Card {
  _key?: string;
  detail: any;
  receiverInfo?: any;
  replyList?: any;
  creatorInfo?: {
    userAvatar: string;
    userName: string;
  };
}
