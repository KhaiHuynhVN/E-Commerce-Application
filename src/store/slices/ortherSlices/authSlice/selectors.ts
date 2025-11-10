import type { RootState } from "../../../store";

const token = (state: RootState) => state.auth.token;
const user = (state: RootState) => state.auth.user;

export { token, user };
