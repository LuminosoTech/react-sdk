import { Action } from "../../models/store/Action";
import { update } from "../../utils/redux";
import { SET_USER } from "../types/user";

export interface UserState {
  error?: any;
  isPostingUser?: boolean;
}

export const userInitialState: UserState = {
  error: undefined,
  isPostingUser: false,
};

const userReducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case SET_USER.REQUEST:
      return update(state, {
        error: undefined,
        isPostingUser: true,
      });
    case SET_USER.SUCCESS:
      return update(state, {
        isPostingUser: false,
      });
    case SET_USER.FAILURE:
      return update(state, {
        error: action.payload,
        isFetching: false,
      });
    default:
      return state;
  }
};

export default userReducer;
