const DonorSchema = new dynamoose.Schema(
  {
    code: {
      type: String,
      hashKey: true,
      required: true,
    },
    token_name: {
      type: String,
      required: true,
    },
    owner_user_id: {
      type: String,
      required: false,
      index: {
        name: 'ownerUserIdIndex',
        global: true,
      },
    },
    token_id: {
      type: String,
      required: false,
    },
    token_uri: {
      type: String,
      required: false,
    },
    image_url: {
      type: String,
      required: false,
    },
    is_verified: {
      type: Boolean,
      require: false
    },
    is_used: {
      type: Boolean,
      require: false
    },
    is_sent_token: {
      type: Boolean,
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

module.exports = DonorSchema;
