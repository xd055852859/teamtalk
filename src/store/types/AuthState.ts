import { User, Group, Member } from "@/interface/User";

export interface AuthState {
  user: User | null;
  groupList: Group[];
  muteList: string[];
  groupItem: Group | null;
  memberList: Member[];
  followList: Member[];
  token: string;
  uploadToken: string | null;
  groupTitle: string;
  groupRole: number;
}
