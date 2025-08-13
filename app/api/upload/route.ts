/* 

import { NextRequest, NextResponse } from "next/server";



import {GetObjectAclCommand, PutObjectAclCommand,ListObjectsV2Command, S3Client} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const client = new  S3Client({

    credentials : {
         accessKeyId : process.env.AWS_ACESS_KEY as string,
        secretAccessKey : process.env.AWS_SECRET_KEY  as string
    },
     region : 'eu-north-1'
})


export async function GET(req:NextRequest , res : NextResponse){
    const key = req.nextUrl.searchParams.get('key');
    if(!key) throw new Error('key is required')

        const command = new PutObjectAclCommand({
             Bucket :'s3ayush-bucket',
             Key : key 
        })


        const  url = await getSignedUrl(client ,command , {expiresIn : 3600})

        return NextResponse.json({
            url
        })
} */





        import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
  region: "eu-north-1",
});

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) throw new Error("key is required");

  const command = new PutObjectCommand({
    Bucket: "s3ayush-bucket",
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return NextResponse.json({
    url,
  });
}