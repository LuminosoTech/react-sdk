import { combineReducers } from "../../utils/redux";

import userReducer, { UserState } from "./user";

export { userInitialState } from "./user";

export interface RootState {
  user: UserState;
}

export default combineReducers({
  user: userReducer,
});
