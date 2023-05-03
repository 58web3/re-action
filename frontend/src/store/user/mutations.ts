export const SET_USER_DATA = (
  state: any,
  { data, address, chainId, web3auth }: any
) => {
  state.data = data;
  state.address = address;
  state.chainId = chainId;
  state.web3auth = web3auth;
};
export const SET_USER_ID = (state: any, { user_id }: { user_id: string }) => {
  state.user_id = user_id;
};
export const ET_VOTE_SUMMARY = (
  state: any,
  { vote_count_left }: { vote_count_left: number }
) => {
  state.vote_count_left = vote_count_left;
};
