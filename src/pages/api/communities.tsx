import { ServerResponse } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { SiteClient } from "datocms-client"
import { slugfy } from "../../utils/GitKutUtils"

export default async function Communities(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new SiteClient(process.env.DATO_FULL_ACCESS_API_TOKEN)
  const tasks = {
    GET: methodNotAllowed,
    POST: createCommunity,
    PUT: updateCommunity,
    DELETE: updateCommunity,
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

async function createCommunity(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // ToDO: Create Community
  const community = JSON.parse(req.body)
  const createdCommunity = await client.items.create({
    itemType: "1026835",
    slug: slugfy(community.title),
    member: JSON.stringify([community.creatorId]),
    ...community,
  })

  res.status(201).json(JSON.stringify(createdCommunity))
}

async function updateCommunity(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // Update Community
  console.log("Update Community")
  res.status(201).json({
    statusCode: 201,
    errorMessage: "Updated",
  })
}

async function deleteCommunity(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // Update Community
  console.log("Delete Community")
  res.status(204).json({
    statusCode: 204,
    errorMessage: "No content",
  })
}
