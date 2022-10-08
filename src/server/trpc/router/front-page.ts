import { t } from "../trpc";
import S3 from 'aws-sdk/clients/s3';

export const frontPageRouter = t.router({
    getImages: t.procedure.query(() => {
        const imageBucket = new S3({
            params: { Bucket: 'hack-ohio-22-tierlist-images' },
            apiVersion: '2006-03-01',
            region: "us-east-1",
        });

        const image_names = ["xml_tree.jpg"];
        const images: S3.Body[] = [];
        for (const image_name of image_names) {
            imageBucket.getObject({ Bucket: 'hack-ohio-22-tierlist-images', Key: image_name }, (err, data) => {
                if (err) {
                    console.error(err)
                } else {
                    if (data.Body) {
                        images.push(data.Body);
                    } else {
                        console.error("data.Body is undefined!");
                    }
                }
            })
        }
        return images;
    }),
});
