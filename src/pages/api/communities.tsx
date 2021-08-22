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
    DELETE: deleteCommunity,
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
    members: JSON.stringify([community.creatorId]),
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
  const user = req.body.user
  const itemId = req.body.communityId

  const community = await client.items.all({
    filter: {
      type: "community",
      fields: {
        id: { eq: itemId },
      },
    },
  })

  const oldMembers = JSON.parse(community[0].members)
  const members = [
    ...oldMembers,
    {
      userId: user.login.toLowerCase(),
      imageUrl: user.avatar_url,
    },
  ]

  const updatedCommunity = await client.items.update(itemId, {
    members: JSON.stringify(members),
  })

  res.status(201).json(JSON.stringify(updatedCommunity))
}

async function deleteCommunity(
  req: NextApiRequest,
  res: NextApiResponse,
  client: SiteClient
) {
  // Update Community
  const user = req.body.user
  const itemId = req.body.communityId

  const community = await client.items.all({
    filter: {
      type: "community",
      fields: {
        id: { eq: itemId },
      },
    },
  })

  const oldMembers = JSON.parse(community[0].members)
  const members = oldMembers.filter(
    (member) => member.userId !== user.login.toLowerCase()
  )

  const updatedCommunity = await client.items.update(itemId, {
    members: JSON.stringify(members),
  })

  res.status(204).json({})
}
