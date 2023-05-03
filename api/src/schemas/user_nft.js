const UserNFTSchema = new dynamoose.Schema(
  {
    user_id: {
      type: String,
      hashKey: true,
      required: true,
    },
    token_address: {
      type: String,
      rangeKey: true,
      required: true,
    },
    wallet_address: {
      type: String,
      required: true,
      index: {
        name: 'walletAddressIndex',
        global: true,
      },
    },
    token_ids: {
      type: Array,
      schema: [{
        type: Object,
        schema: {
          token_id: String,
          name: String,
          symbol: String,
          token_uri: String,
          image_url: String,
          metadata: String,
          owner_of: String,
        }
      }],
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

module.exports = UserNFTSchema;
