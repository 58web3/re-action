const TokenSchema = new dynamoose.Schema(
  {
    token_name: {
      type: String,
      hashKey: true,
      required: true,
    },
    contract_address: {
      type: String,
      required: false,
    },
    contract_type: {
      type: String,
      required: false,
    },
    symbol: {
      type: String,
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

module.exports = TokenSchema;
