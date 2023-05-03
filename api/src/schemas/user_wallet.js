const UserWalletSchema = new dynamoose.Schema(
    {
      wallet_address: {
        type: String,
        hashKey: true,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
      },
      wallet_public_key: {
        type: String,
        required: true,
        index: {
          name: 'walletPublicKeyIndex',
          global: true,
        },
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

module.exports = UserWalletSchema;
