const CsrfSchema = new dynamoose.Schema(
    {
      csrf_token: {
        type: String,
        hashKey: true,
        required: true,
      },
      secret: {
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

module.exports = CsrfSchema;
