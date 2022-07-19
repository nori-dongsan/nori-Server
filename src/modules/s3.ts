import { env } from "../env"
import AWS from "aws-sdk"

const s3 = new AWS.S3({
    accessKeyId: env.s3.accessKey,
    secretAccessKey: env.s3.secretKey,
    region: 'ap-northeast-2',
    s3ForcePathStyle: true,
})

export default s3;