import { Message } from "@/interface/Message";
import { Group } from "@/interface/User";
import { Editor } from "@tiptap/vue-3";

export interface MessageState {
  receiver: Group | null;
  talker: Group | null;
  talkKey: string;
  receiverType: string;
  receiverNumber: number;
  pageNumber: number;
  page: number;
  messageList: Message[];
  editContent: any;
  editKey: string;
  editorInfo: Editor | null;
}
