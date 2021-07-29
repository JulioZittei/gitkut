export async function getUserInfo(githubUser) {
  const data = await fetch(`https://api.github.com/users/${githubUser}`).then(
    (response) => {
      if (response.ok) {
        return response.json()
      }

      throw new Error(
        `Request Error. Response status code: ${response.status} status message: ${response.statusText} `
      )
    }
  )
  return data
}

export async function getFollowers(githubUser) {
  const data = await fetch(
    `https://api.github.com/users/${githubUser}/followers?per_page=6`
  ).then((response) => {
    if (response.ok) {
      return response.json()
    }

    throw new Error(
      `Request Error. Response error status code: ${response.status} status message: ${response.statusText} `
    )
  })

  return data
}

export async function getFollowing(githubUser) {
  const data = await fetch(
    `https://api.github.com/users/${githubUser}/following?per_page=6`
  ).then((response) => {
    if (response.ok) {
      return response.json()
    }

    throw new Error(
      `Request Error. Response error status code: ${response.status} status message: ${response.statusText} `
    )
  })
  return data
}

export async function getCommunities(githubuser) {
  const data = await fetch(`https://graphql.datocms.com/`, {
    method: "POST",
    headers: {
      Authorization: process.env.DATO_READ_ONLY_API_TOKEN,
      "Content-Type": "aplication/json",
      Accept: "aplication/json",
    },
    body: JSON.stringify({
      query: `query {
	
        allCommunities(
          filter: {
            creatorId: {eq: "${githubuser}"}
          }
          first: 6
        ){
          id
          title
          imageUrl
          slug
        }
        
        _allCommunitiesMeta(
          filter: {
            creatorId: {eq: "${githubuser}"}
          }
        ) {
          count
        }
      
      }`,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    throw new Error(
      `Request Error. Response error status code: ${response.status} status message: ${response.statusText} `
    )
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
