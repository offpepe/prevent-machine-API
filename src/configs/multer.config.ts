import multer from 'multer';
import multerS3 from 'multer-s3';
import AwsSdk from 'aws-sdk';
import TemporaryStorage from "../utils/TemporaryStorage";

const { S3_BUCKET_NAME } = process.env
const date = new Date().toLocaleDateString('pt-BR');

AwsSdk.config.region = 'us-east-2';
const s3Bucket = new AwsSdk.S3({});
console.log(S3_BUCKET_NAME);
const uploadAssetImage = multer({
    storage: multerS3({
        s3: s3Bucket,
        bucket: S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname, filename: req.body.name });
        },
        key: (req, file, cb) => {
            TemporaryStorage.pull().then(({ userId, role}) => {
                cb(null, `assets/${userId}.${file.mimetype.split('/')[1]}`)
                req.body.tokenData = { userId, role };
            });
        }
    })
}).single('image');

export default uploadAssetImage;


