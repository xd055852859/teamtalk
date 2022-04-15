import { User, Group, Member } from "@/interface/User";

export interface AuthState {
  user: User | null;
  groupList: Group[];
  groupItem: Group | null;
  memberList: Member[];
  token: string;
  uploadToken: string | null;
  groupTitle: string;
  groupRole: number;
}
