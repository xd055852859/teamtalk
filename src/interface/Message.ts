import { User } from "./User";

export interface Message {
  _key: string;
  cover: null | string;
  creatorInfo: User;
  unRead?: number;
  receiverKey: string;
  receiverTitle: null | string;
  receiverType: string;
  receiverAvatar: null | string;
  summary: string;
  type?: string;
  title: string;
  refCardInfo?: any;
  commentCount?: number;
  favorite: boolean;
  atUser?: string;
  hasRead?: number;
  createTime?: string;
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
  title?: string;
  createTime?: number;
}
export interface Reply {
  cardKey: string;
  content: string;
  createTime: number;
  userAvatar: string;
  userKey: string;
  userName: string;
  _key: string;
  atUser: string;
  atUserName?: string;
}
export interface Read {
  hasRead: number;
  readTime: string;
  userAvatar: string;
  userName: string;
  _key: string;
}
