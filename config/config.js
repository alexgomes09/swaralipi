export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,
  aws_table_name: "swaralipi",
  aws_db_config: {
    accessKeyId: "ACCESS_KEY_ID",
    secretAccessKey: "SECRET_ACCESS_KEY",
    region: "us-east-1",
  },
};