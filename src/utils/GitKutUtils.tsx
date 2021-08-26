export async function getUserInfo(githubUser) {
  const data = await fetch(`https://api.github.com/users/${githubUser}`).then(
    (response) => {
      if (response.ok) {
        return response.json()
      }

      console.log(`${response.status} ${response.statusText}`)
      return {
        statusError: response.status,
      }
    }
  )
  return data
}

export async function getFollowers(githubUser: string, first?: number) {
  const data = await fetch(
    `https://api.github.com/users/${githubUser}/followers?per_page=${first}`
  ).then((response) => {
    if (response.ok) {
      return response.json()
    }

    console.log(`${response.status} ${response.statusText}`)
    return {
      statusError: response.status,
    }
  })

  return data
}

export async function getFollowing(githubUser: string, first?: number) {
  const data = await fetch(
    `https://api.github.com/users/${githubUser}/following?per_page=${first}`
  ).then((response) => {
    if (response.ok) {
      return response.json()
    }

    console.log(`${response.status} ${response.statusText}`)
    return {
      statusError: response.status,
    }
  })
  return data
}

export async function getCommunity(slug?: string) {
  const data = await fetch(`https://graphql.datocms.com/`, {
    method: "POST",
    headers: {
      Authorization: process.env.DATO_READ_ONLY_API_TOKEN,
      "Content-Type": "aplication/json",
      Accept: "aplication/json",
    },
    body: JSON.stringify({
      query: `query {
	
        community
        ${
          slug
            ? `(
          ${
            slug &&
            `filter: {
            slug: {eq: "${slug.toLowerCase()}"}
          }`
          }
          
        )`
            : ``
        }        
        {
          id
          title
          imageUrl
          slug
          _createdAt
          category
          communityType
          language
          location
          members
          creatorId
        }
      }`,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    console.log(`${response.status} ${response.statusText}`)
    return {
      statusError: response.status,
    }
  })
  return data
}

export async function getCommunities(githubuser?: string, first?: number) {
  const data = await fetch(`https://graphql.datocms.com/`, {
    method: "POST",
    headers: {
      Authorization: process.env.DATO_READ_ONLY_API_TOKEN,
      "Content-Type": "aplication/json",
      Accept: "aplication/json",
    },
    body: JSON.stringify({
      query: `query {

        allCommunities
        ${
          githubuser || first
            ? `(
          ${
            githubuser
              ? `filter: {
            creatorId: {eq: "${githubuser.toLowerCase()}"}
          }`
              : ``
          }
          ${first && `first: ${first}`}
          
        )`
            : ``
        }        
        {
          id
          title
          imageUrl
          slug
          _createdAt
          category
          communityType
          language
          location
          members
          creatorId
        }
        
        _allCommunitiesMeta
        ${
          githubuser
            ? `(
          ${
            githubuser
              ? `filter: {
            creatorId: {eq: "${githubuser.toLowerCase()}"}
          }`
              : ``
          }
        )`
            : ``
        }
        {
          count
        }
      
      }`,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    console.log(`${response.status} ${response.statusText}`)
    return {
      statusError: response.status,
    }
  })
  return data
}

export async function getPosts(githubuser) {
  const data = await fetch(`https://graphql.datocms.com/`, {
    method: "POST",
    headers: {
      Authorization: process.env.DATO_READ_ONLY_API_TOKEN,
      "Content-Type": "aplication/json",
      Accept: "aplication/json",
    },
    body: JSON.stringify({
      query: `query {
	
        allPosts(filter: {
          creatorId: {eq: "${githubuser}"}
        }
        orderBy: [createdAt_DESC]) {
          id
          description
          creatorId
        }
      }`,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    console.log(`${response.status} ${response.statusText}`)
    return {
      statusError: response.status,
    }
  })
  return data
}

export function slugfy(data: string) {
  return data
    .toLowerCase()
    .replace(/[àÀáÁâÂãäÄÅåª]+/g, "a") // Special Characters #1
    .replace(/[èÈéÉêÊëË]+/g, "e") // Special Characters #2
    .replace(/[ìÌíÍîÎïÏ]+/g, "i") // Special Characters #3
    .replace(/[òÒóÓôÔõÕöÖº]+/g, "o") // Special Characters #4
    .replace(/[ùÙúÚûÛüÜ]+/g, "u") // Special Characters #5
    .replace(/[ýÝÿŸ]+/g, "y") // Special Characters #6
    .replace(/[ñÑ]+/g, "n") // Special Characters #7
    .replace(/[çÇ]+/g, "c") // Special Characters #8
    .replace(/[ß]+/g, "ss") // Special Characters #9
    .replace(/[Ææ]+/g, "ae") // Special Characters #10
    .replace(/[Øøœ]+/g, "oe") // Special Characters #11
    .replace(/[%]+/g, "pct") // Special Characters #12
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}
