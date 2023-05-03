<template>
  <div class="notification" v-if="!isHidden" v-bind:class="{'unread': notification?.is_read != true, 'inactive': notification?.type === 'receive_vote'}">
    <div class="notification--left">
      <div class="notification--avatar"
        v-bind:style="{
          backgroundImage: 'url(' + profileImage + ')',
        }"
      >
      </div>
    </div>
    <div class="notification--right--body">
      <div v-if="notification?.type === 'receive_vote'">
        <p class="notification--right--body--userinfo">{{$t("vote_start_announce")}}</p>
        <p v-if="lang === 'ja'" class="notification--right--body--vote--theme">{{$t("vote_theme")}} : {{this.themeNameInVote?.ja}}</p>
        <p v-else>{{$t("vote_theme")}} : {{this.themeNameInVote?.en}}</p>
        <p>{{$t("maximum")}} {{userMaxVoteCount}} {{$t("upto_vote_available")}}</p>
      </div>
      <div v-else class="notification--right--body">
        <p class="notification--right--body--userinfo">{{userName}} {{actionMade(notification?.type)}}</p>
        <!-- <p>{{postText}}</p> -->
        <p class="notification--right--body--comment">{{commentText}}</p>
      </div>
      <div class="notification--right--bottom">
        {{ago}}
      </div>
    </div>
  </div>
</template>

<script>
import axiosServices from "../services/axiosServices";
import { API_ENDPOINT } from "@/constants/api";
import moment from "moment";
import { mapState } from "vuex";
import axios, { AxiosAdapter } from "axios";
import { cacheAdapterEnhancer } from 'axios-extensions';

export default {
  name: 'Notification',
  props: {
    notification: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data() {
    return {
      profileImageUrl: null,
      profileImage: null,
      userName: null,
      postId: null,
      commentId: null,
      // postText: null,
      commentText: "",
      ago: null,
      themeNameInVote: "",
      isHidden: false
    }
  },
  mounted() {
    this.isHidden = false;
    let date = new Date(this.notification.created_at);
    this.ago = moment(date, "ddd MMM DD YYYY HH:mm:ss GMT Z").fromNow();
  },
  methods: {
    actionMade(type) {
      if (!type) {
        return '';
      }
      switch(type) {
        case 'comment':
          return this.$t("commented_your_post");
        case 'receive_vote':
          return this.$t("vote_assigned");
        case 'vote_post':
          return this.$t("voted_your_post");
        default:
          return ''
      }
    }
  },
  watch: {
    notification: {
      handler(n, o) {
        let fromId = n?.from;
        let type = n?.type;
        if (type === "comment") {
          this.commentId = n?.comment_id;
        } else {
          this.commentId = null;
          this.commentText = null;
        }
        if (type === "comment" || type === "vote_post") {
          this.postId = n?.post_id;
        } else {
          this.postId = null;
          this.postText = null;
        }
        if (type === "receive_vote") {
          this.profileImage = this.serviceLogoUrl;
          return;
        }

        if (fromId) {
          // use cache
          this.$axios
          .get(`${API_ENDPOINT}/v1/user/${fromId}`, {
            params:{
              user_id: fromId,
              dao_id: this.daoId
            }
          })
          .then(async (res) => {
            this.userName = res.data?.nickname;
            this.profileImageUrl = res.data?.profile_image_url;
          })
          .catch(async (e) => {
            console.error("Notification: Get User error", e);
          });

        }
      },
      immediate: true,
      deep: true,
    },
    postId: {
      handler(n, o) {
        if (n) {
          let _this = this;
          if (this.commentId) {
            // use cache
            this.$axios
            .get(`${API_ENDPOINT}/v1/post/${n}/comment/${this.commentId}`, {
              params: {
                dao_id: this.daoId
              },
            })
            .then(async (res) => {
              if (res.status === 200) {
                this.commentText = res?.data?.comment;  
              }
            })
            .catch(async (e) => {
              console.error("Faild to get comment", e);
              // Maybe comment is deleted, remove this notifcation
              this.isHidden = true;
            });
          }

        } else {
          this.postText = null;
        }
      },
      immediate: true,
      deep: true
    },
    async profileImageUrl(newVal) {
      if (newVal) {
        // Use cache
        this.$axios
        .get(`${API_ENDPOINT}${newVal}`, {
          responseType: "arraybuffer",
        })
        .then(async (res) => {
          const base64 = Buffer.from(res?.data, "binary").toString("base64");
          this.profileImage = "data:image/jpeg;base64," + base64;
        })
        .catch(async (e) => {
          this.profileImage = this.defaultProfileImageUrl;
        });

      } else {
        this.profileImage = this.defaultProfileImageUrl;
      }
    },
    daoThemes: {
      handler(n, o) {
        if (!n) return;
        if ( n.data?.length > 0 ) {
          for (var item of this.daoThemes?.data) {
            let now = moment(Date.now()).format("YYYY/MM/DD hh:mm:ss");
            if (now < item.vote_to && now > item.vote_from) {
              this.themeNameInVote = item.theme_name;
              break;
            }
          }
        }
      },
      immediate: true,
      deep: true,
    }
  },
  computed: {
    ...mapState("lang", {
      lang: "lang",
    }),
     ...mapState("user", {
      userMaxVoteCount: "max_vote_count"
    }),
    defaultProfileImageUrl: function () {
      return require("@/assets/img/icon-profile.png");
    },
    serviceLogoUrl: function() {
      return require("@/assets/img/logo-notification.png");
    }
  }
}
</script>

<style scoped lang="scss">
.notification {
  display: flex;
  justify-content: flex-start;
  height: 180px;
  border-bottom: 1px solid #ddd;
  margin: 12px auto;
  padding: 12px;
  cursor: pointer;

  &.unread {
    background-color: rgba(0, 255, 255, 0.2);
  }

  &.inactive {
    cursor: default;
  }

  &.inactive:hover {
    background-color: transparent;
  }

  &:hover {
    background-color: #eee;
  }

  &--left {
    display: flex;    
    justify-content: center;
    align-items: center;
    width: 20%;
  }
  &--avatar {
    display: flex;
    align-items: center;
    margin: auto;
    background-color: #eee;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-size: cover;
    background-size: center;
    background-repeat: no-repeat;
  }

  &--right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80%;
    padding: 16px;

    &--body {
      text-align: left;
      width: 100%;
      & p {
        margin: 12px auto;
      }
      &--userinfo {
        font-weight: 700;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &--comment {
        color: #555;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &--vote--theme {
        font-weight: 700;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    &--bottom {
      text-align: right;
      width: 100%;
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
