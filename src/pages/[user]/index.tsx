import Head from "next/head"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import { useEffect, useState } from "react"
import { Box } from "../../components/Box"
import { MainGrid } from "../../components/MainGrid"
import { ProfileRelationsBox } from "../../components/ProfileRelationsBox"
import { ProfileSidebar } from "../../components/ProfileSidebar"
import { GitkutMenu } from "../../components/GitKutMenu"
import { InfoBox } from "../../components/InfoBox"
import { OrkutNostalgicIconSet } from "../../components/OrkutNostalgicIconSet"
import {
  getFollowers,
  getFollowing,
  getUserInfo,
  getCommunities,
  getPosts,
} from "../../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Post } from "../../components/Post"

export default function UserPage({ data }) {
  const [userInfo, setUserInfo] = useState(data.userInfo)
  const [following, setFollowing] = useState(data.following)
  const [followers, setFollowers] = useState(data.followers)
  const [communities, setCommunities] = useState(data?.communities)
  const [posts, setPosts] = useState(data.posts)

  const theme = {
    grid: 3,
  }

  useEffect(() => {
    setUserInfo(data.userInfo)
    setFollowers(data.followers)
    setFollowing(data.following)
    setCommunities(data.communities)
    setPosts(data.posts)
  }, [data])

  return (
    <>
      <Head>
        <title>GitKut | {userInfo.name}</title>
      </Head>
      <GitkutMenu userInfo={userInfo} />
      <MainGrid>
        <div className="profileArea">
          <ProfileSidebar userInfo={userInfo} />
        </div>
        <div className="welcomeArea">
          <Box>
            <h1 className="title">{userInfo.name}</h1>
            {userInfo.bio && userInfo.bio !== "" && (
              <blockquote cite={`https://github.com/${userInfo.login}`}>
                <q>{userInfo?.bio}</q>
              </blockquote>
            )}
            <OrkutNostalgicIconSet posts={posts.length} />
            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnCenter">Usuário no GitHub:</td>
                  <td>{userInfo.login}</td>
                </tr>
                {userInfo.company && (
                  <tr>
                    <td className="textOnCenter">Empresa:</td>
                    <td>{userInfo.company}</td>
                  </tr>
                )}
                {userInfo.twitter_username && (
                  <tr>
                    <td className="textOnCenter">Twitter:</td>
                    <td>{`@${userInfo.twitter_username}`}</td>
                  </tr>
                )}
                {userInfo.location && (
                  <tr>
                    <td className="textOnCenter">Localização:</td>
                    <td>{userInfo.location}</td>
                  </tr>
                )}
                <tr>
                  <td className="textOnCenter">Membro desde:</td>
                  <td>{new Date(userInfo.created_at).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </InfoBox>
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
        <div className="profileRelationsArea">
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
  const githubUser = (context.query.user as string).toLocaleLowerCase()

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
    getFollowers(githubUser, 6),
    getFollowing(githubUser, 6),
    getCommunities(),
    getPosts(githubUser),
    getUserInfo(githubUser),
  ]).then((results) => {
    let fetchedData = []

    if (results[4]?.statusError) {
      return {
        statusError: results[4].statusError,
      }
    }

    fetchedData = results[2].data.allCommunities.filter((community) => {
      if (community.members.some((member) => member.userId === githubUser)) {
        return community
      }
    })

    return {
      followers: results[0] || [],
      following: results[1] || [],
      communities: {
        data: fetchedData.slice(0, 6) || [],
        count: fetchedData.length,
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
