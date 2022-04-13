import { Message } from "@/interface/Message";
import { Group } from "@/interface/User";

export interface MessageState {
  receiver: Group | null;
  talker: Group | null;
  receiverType: string;
  receiverNumber: number;
  pageNumber: number;
  page: number;
  messageList: Message[];
  editContent: any;
}
