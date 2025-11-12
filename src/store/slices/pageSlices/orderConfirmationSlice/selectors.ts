import type { RootState } from "@/store";

const orderInfo = (state: RootState) => state.orderConfirmation.orderInfo;

export { orderInfo };
