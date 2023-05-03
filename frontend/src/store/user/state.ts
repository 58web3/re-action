import { Web3Auth } from "@web3auth/modal";

export default () =>
  ({
    data: {},
    address: null as unknown as string,
    chainId: null as unknown as number,
    web3auth: null as unknown as Web3Auth,
    user_id: null as unknown as string,
    max_vote_count: null as unknown as number,
    vote_count_left: null as unknown as number,
  } as any);
