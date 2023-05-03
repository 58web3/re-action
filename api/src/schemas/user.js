const UserSchema = new dynamoose.Schema(
  {
    user_id: {
      type: String,
      hashKey: true,
      required: true,
    },
    wallets: {
      type: Array,
      schema: [{
        type: Object,
        schema: {
          wallet_address: String,
          wallet_public_key: String,
        },
      }],
    },
    nickname: {
      type: String,
      required: false,
    },
    type_of_login: {
      type: String,
      required: false,
    },
    is_sent_token: {
      type: Boolean,
      required: false,
    },
    is_admin: {
      type: Boolean,
      required: false,
    },
    is_logged_in: {
      type: Boolean,
      required: false,
    },
    user_role_ids: {
      type: Array,
      schema: [String],
      required: false,
    },
    created_at: {
      type: Number,
      required: false,
    },
    created_by: {
      type: String,
      required: false,
    },
    updated_at: {
      type: Number,
      required: false,
    },
    updated_by: {
      type: String,
      required: false,
    },
    delete_flg: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UserSchema;
