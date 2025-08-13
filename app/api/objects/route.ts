import { NextRequest, NextResponse } from "next/server";



import {ListObjectsV2Command, S3Client} from "@aws-sdk/client-s3"


const client = new  S3Client({

    credentials : {
         accessKeyId : process.env.AWS_ACESS_KEY as string,
        secretAccessKey : process.env.AWS_SECRET_KEY  as string
    },
     region : 'eu-north-1'
})


export async function GET (req:NextRequest) {

    const prefix = req.nextUrl.searchParams.get('prefix') ?? undefined

    const command = new ListObjectsV2Command({

       Bucket :'s3ayush-bucket',

         Delimiter : '/',
       Prefix : prefix

      


    });



    const result =  await client.send(command );
    console.log(result)


    const rootfiles =  result.Contents?.map(e=>({
        Key : e.Key,
        Size : e.Size,
       LastModified : e.LastModified
    }))  || [] ;



    const rootfolder = result.CommonPrefixes?.map((e)=> e.Prefix) ||  []


    return NextResponse.json({
        files : rootfiles,
        folder : rootfolder
    })


   
    
}