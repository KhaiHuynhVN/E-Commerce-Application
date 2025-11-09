import type { RootState } from "../../../store";

const isLoading = (state: RootState) => state.globalLoader.isLoading;

export { isLoading };
