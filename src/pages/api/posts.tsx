import { NextApiRequest, NextApiResponse } from "next"
import { SiteClient } from "datocms-client"

export default async function Posts(req: NextApiRequest, res: NextApiResponse) {
  const client = new SiteClient(process.env.DATO_FULL_ACCESS_API_TOKEN)
  const tasks = {
    GET: methodNotAllowed,
    POST: createPost,
    PUT: updatePost,
    DELETE: updatePost,
  }
  await tasks[req.method](req, res, client)
}

async function methodNotAllowed(
  req: NextApiRequest,
  res: NextApiResponse,
  client?: SiteClient
) {
  res.status(405).json({
    statusCode: 405,
    errorMessage: "Method not allowed",
  })
}

async function createPost(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // ToDO: Create Community
  const post = JSON.parse(req.body)
  const createdPost = await client.items.create({
    itemType: "1076102",
    ...post,
  })

  res.status(201).json(JSON.stringify(createdPost))
}

async function updatePost(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // Update Community
  console.log("Update Post")
  res.status(201).json({
    statusCode: 201,
    errorMessage: "Updated",
  })
}

async function deletePost(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // Update Community
  console.log("Delete Post")
  res.status(204).json({
    statusCode: 204,
    errorMessage: "No content",
  })
}
