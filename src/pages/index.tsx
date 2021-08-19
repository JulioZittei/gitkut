import Head from "next/head"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import { useState } from "react"
import { Box } from "../components/Box"
import { MainGrid } from "../components/MainGrid"
import { ProfileRelationsBox } from "../components/ProfileRelationsBox"
import { ProfileSidebar } from "../components/ProfileSidebar"
import { GitkutMenu } from "../components/GitKutMenu"
import { OrkutNostalgicIconSet } from "../components/OrkutNostalgicIconSet"
import { Post } from "../components/Post"
import {
  getFollowers,
  getFollowing,
  getUserInfo,
  getCommunities,
  getPosts,
} from "../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

export default function HomePage({ data }) {
  const [userInfo, setUserInfo] = useState(data.userInfo)
  const [following, setFollowing] = useState(data.following)
  const [followers, setFollowers] = useState(data.followers)
  const [communities, setCommunities] = useState(data.communities)
  const [posts, setPosts] = useState(data.posts)
  const [formOption, setFormOption] = useState(0)

  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false)
  const [isCreatingPost, setIsCreatingPost] = useState(false)

  async function handleCreateCommunity(event) {
    event.preventDefault()
    let createdCommunity = null

    setIsCreatingCommunity(true)

    const formData = new FormData(event.target)
    const community = {
      title: formData.get("name"),
      imageUrl: formData.get("imageUrl"),
      creatorId: userInfo.login.toLocaleLowerCase(),
      category: "Pessoas",
      communityType: "Pública",
      language: "Português",
      location: "Brasil",
      member: JSON.stringify([userInfo.login.toLocaleLowerCase()]),
    }

    try {
      createdCommunity = await fetch("/api/communities", {
        method: "POST",
        body: JSON.stringify(community),
      }).then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
    } catch (error) {
      console.log(`${error.message}`)
    }

    if (communities.data.length < 6) {
      setCommunities({
        data: [createdCommunity, ...communities.data],
        count: communities.count + 1,
      })
    } else {
      setCommunities({
        data: [...communities.data],
        count: communities.count + 1,
      })
    }

    setIsCreatingCommunity(false)
    event.target.reset()
  }

  async function handleCreatePost(event) {
    event.preventDefault()
    let createdPost = null

    setIsCreatingPost(true)

    const formData = new FormData(event.target)
    const post = {
      description: formData.get("description"),
      creatorId: userInfo.login.toLocaleLowerCase(),
    }

    try {
      createdPost = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(post),
      }).then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
    } catch (error) {
      console.log(`${error.message}`)
    }

    setIsCreatingPost(false)
    setPosts([createdPost, ...posts])
    event.target.reset()
  }

  return (
    <>
      <Head>
        <title>GitKut | {userInfo.name}</title>
      </Head>
      <GitkutMenu userInfo={userInfo} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar userInfo={userInfo} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem-vindo(a) {userInfo.name}</h1>
            {userInfo.bio && userInfo.bio !== "" && (
              <blockquote cite={`https://github.com/${userInfo.login}`}>
                <q>{userInfo?.bio}</q>
              </blockquote>
            )}
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <div className="optionButtons">
              <button onClick={() => setFormOption(0)}>Criar comunidade</button>
              <button onClick={() => setFormOption(1)}>Deixar um recado</button>
            </div>

            {formOption === 0 && (
              <form onSubmit={handleCreateCommunity}>
                <input
                  type="text"
                  name="name"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  required
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Coloque uma URL para usarmos de capa."
                  aria-label="Coloque uma URL para usarmos de capa."
                  required
                />

                <button type="submit" disabled={isCreatingCommunity}>
                  {isCreatingCommunity ? "Criando..." : "Criar comunidade"}
                </button>
              </form>
            )}

            {formOption === 1 && (
              <form onSubmit={handleCreatePost}>
                <div>
                  <textarea
                    name="description"
                    placeholder="Digite seu recado aqui..."
                    aria-label="Digite seu recado aqui"
                    autoComplete="off"
                    required
                  />
                </div>

                <button type="submit" disabled={isCreatingPost}>
                  {isCreatingPost ? "Publicando..." : "Publicar"}
                </button>
              </form>
            )}
          </Box>

          {posts.length > 0 && (
            <Box>
              <h1 className="subTitle">Posts recentes</h1>
              <ul>
                {posts.map((post) => {
                  return (
                    <Post key={post.id}>
                      <a>
                        <img src={`https://github.com/${post.creatorId}.png`} />
                      </a>
                      <div>
                        <span>{post.creatorId}</span>
                        <p>{post.description}</p>
                      </div>
                    </Post>
                  )
                })}
              </ul>
            </Box>
          )}
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox
            githubUser={userInfo.login.toLowerCase()}
            title="Seguidores"
            urlBase=""
            totalItems={userInfo.followers}
            items={followers}
            props={{
              id: "id",
              title: "login",
              slug: "login",
              imageUrl: "avatar_url",
            }}
          />

          <ProfileRelationsBox
            githubUser={userInfo.login.toLowerCase()}
            title="Seguindo"
            urlBase=""
            totalItems={userInfo.following}
            items={following}
            props={{
              id: "id",
              title: "login",
              slug: "login",
              imageUrl: "avatar_url",
            }}
          />

          <ProfileRelationsBox
            githubUser={userInfo.login.toLowerCase()}
            title="Comunidades"
            urlBase="/communities"
            totalItems={communities.count}
            items={communities.data}
            props={{
              id: "id",
              title: "title",
              slug: "slug",
              imageUrl: "imageUrl",
            }}
          />
        </div>
      </MainGrid>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  const decodedToken = jwt.decode(token)
  const githubUser = decodedToken?.githubUser

  /* Api broken, the response is always true, even when the user does not exist */

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((response) => response.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  const data = await Promise.all([
    getFollowers(githubUser),
    getFollowing(githubUser),
    getCommunities(githubUser),
    getPosts(githubUser),
    getUserInfo(githubUser),
  ]).then((results) => {
    if (results[4]?.statusError) {
      return {
        statusError: results[4].statusError,
      }
    }
    return {
      followers: results[0] || [],
      following: results[1] || [],
      communities: {
        data: results[2].data.allCommunities || [],
        count: results[2].data._allCommunitiesMeta.count,
      },
      posts: results[3].data.allPosts || [],
      userInfo: results[4],
    }
  })

  if (data?.statusError === 404) {
    return {
      redirect: {
        destination: "/login?userDoesNotExists",
        permanent: false,
      },
    }
  } else if (data?.statusError === 403) {
    return {
      redirect: {
        destination: "/login?rateLimit",
        permanent: false,
      },
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}
