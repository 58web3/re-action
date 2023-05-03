import { Commit } from "vuex";
import { API_ENDPOINT } from "@/constants/api";
import axiosServices from "@/services/axiosServices";

export const FETCH_USER_ID = async function (
  { state }: { commit: Commit; state: any },
  {
    wallet_address,
  }: {
    wallet_address: string;
  }
) {
  const result = await axiosServices.get(
    `${API_ENDPOINT}/v1/wallet/${wallet_address}/user_id`,
    {}
  );
  state.user_id = result.data.user_id;
};
export const FETCH_USER = async function ({
  state,
}: {
  commit: Commit;
  state: any;
}) {
  const result = await axiosServices.get(
    `${API_ENDPOINT}/v1/user/${state.user_id}`,
    {
      params: {
        user_id: state.user_id
      },
    }
  );
  state.data = result.data;
};
export const UPDATE_USER = async function (
  { state }: { state: any },
  {
    user_id,
    nickname,
    profile_image_url,
    dao_id,
  }: {
    user_id: string;
    nickname: string;
    profile_image_url: string;
    dao_id: string;
  }
) {
  try {
    const result = await axiosServices.put(
      `${API_ENDPOINT}/v1/user/${user_id}?dao_id=${dao_id}`,
      {
        nickname,
        profile_image_url,
      }
    );

    if (result.data.message === "Success") {
      state.data.nickname = nickname;
      state.data.profile_image_url = profile_image_url;
    }
    return result.status;
  } catch (e) {
    return e;
  }
};
export const FETCH_VOTE_SUMMARY = async function (
  {
    commit,
    state,
    rootState,
  }: {
    commit: any;
    state: any;
    rootState: any;
  },
  {
    dao_id,
    user_id,
    theme_id,
    callback,
  }: {
    dao_id: string;
    user_id: string;
    theme_id: string;
    callback: (arg0: {}) => void;
  }
) {
  axiosServices
    .get(`${API_ENDPOINT}/v1/user/${user_id}/vote-summary`, {
      params: {
        theme_id,
        dao_id,
      },
    })
    .then((res: any) => {
      if (res.status != 200) {
        callback({
          status: "fail",
          post: false,
        });
        return;
      }
      state.max_vote_count = res.data?.max_vote_count;
      state.vote_count_left = res.data?.max_vote_count - res.data?.voted_count;

      callback({
        status: "success",
      });
    })
    .catch(async (e: any) => {
      console.error("error fetched vote summary", e);
      callback({
        status: "fail",
      });
    });
};
