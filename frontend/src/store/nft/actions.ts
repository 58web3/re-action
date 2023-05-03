import { API_ENDPOINT } from "@/constants/api";
import axiosServices from "@/services/axiosServices";

export const FETCH_USER_NFTS = async function (
  { state }: { state: any },
  walletAddress: String
) {
  const result = await axiosServices.get(
    `${API_ENDPOINT}/v1/wallet/${walletAddress}/nft`,
    {}
  );
  state.data = result.data;
};
