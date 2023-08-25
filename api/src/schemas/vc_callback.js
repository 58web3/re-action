const VCCallbackSchema = new dynamoose.Schema(
    {
      key: {
        type: String,
        hashKey: true,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      type: {
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

module.exports = VCCallbackSchema;
