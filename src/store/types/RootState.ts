import { CommonState } from "./CommonState";
import { AuthState } from "./AuthState";
import { MessageState } from "./MessageState";
export interface RootState {
  common: CommonState;
  auth: AuthState;
  message: MessageState;
}
