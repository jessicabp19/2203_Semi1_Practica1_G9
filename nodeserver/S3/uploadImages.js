const aws = require("aws-sdk");
const awsKeyS3 = require("./credentials");
const s3 = new aws.S3(awsKeyS3);
const uuid = require('uuid');

const uploadImageS3 = async (image, imageExt) => {
    const pathComplete = `foto/${uuid.v4()}.${imageExt}`;
    const buffer = new Buffer.from(image, "base64");
    try {
        const bucketParams = {
        Bucket: "bucket-imagen-semi1",
        Key: pathComplete,
        Body: buffer,
        ContentType: "image",
        ACL: "public-read",
        };
        const response = await s3.upload(bucketParams).promise();
        var url = response.Location.split('amazonaws.com/')
        return url[1];
    } catch (error) {
        console.log(error);
        throw error
    }

};

module.exports = {
    uploadImageS3,
};