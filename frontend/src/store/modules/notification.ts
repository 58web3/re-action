import { API_ENDPOINT } from '@/constants/api';
import axiosServices from '@/services/axiosServices';

interface IStateNotification {
  data: []
}

const state = {
  data: {}
} as IStateNotification

const actions = {
  async FETCH_NOTIFICATIONS(
    { state }: { state: IStateNotification }, 
    { 
      dao_id, 
      count, 
      last_timestamp
    } : { 
      dao_id: string;
      count: number;
      last_timestamp: number;
    }) {

    try {
      const result = await axiosServices.get(`${API_ENDPOINT}/v1/notification`, {
        params: {
          dao_id,
          count,
          last_timestamp
        }
      })
      state.data = result.data.notifications;
      // console.log("GET notifications result", result);
      return state.data

    } catch(e) {
      console.error("notification error", e);
      return null;
    } 

  },
  async DEFLAG_NOTIFICATIONS(
    {
      commit,
      state,
      rootState,
    }: { commit: any; state: IStateNotification; rootState: any },
    {
      dao_id,
      callback,
    }: {
      dao_id: string;
      callback: (arg0: {}) => void;
    }
  ) {
    axiosServices
    .post(`${API_ENDPOINT}/v1/notification?dao_id=${dao_id}`, {
    })
    .then((res: any) => {
      if (res.status === 200) {
        callback({
          status: "success",
        });
      } else {
        callback({
          status: "fail",
        });
      }
    })
    .catch(async (e) => {
      console.error("Failed to deflag notification", e.response?.data);
      callback({
        status: "fail",
      });
    });
  },
} as any

export default {
  namespaced: true,
  state,
  actions
}
