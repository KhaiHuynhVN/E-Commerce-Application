import type { RootState } from "../../../store";

const token = (state: RootState) => state.auth.token;

export { token };
