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
import {
  getFollowers,
  getFollowing,
  getUserInfo,
  getCommunities,
} from "../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

export default function HomePage({ data }) {
  const [userInfo, setUserInfo] = useState(data.userInfo)
  const [following, setFollowing] = useState(data.following)
  const [followers, setFollowers] = useState(data.followers)
  const [communities, setCommunities] = useState(data?.communities)

  async function handleCreateCommunity(event) {
    event.preventDefault()
    let createdCommunity = null
    const loading = document.querySelector(".loading")
    loading.setAttribute("style", "display:flex;")

    const formData = new FormData(event.target)
    const community = {
      title: formData.get("name"),
      imageUrl: formData.get("imageUrl"),
      creatorId: userInfo.login.toLocaleLowerCase(),
    }

    try {
      createdCommunity = await fetch("/api/comunidades", {
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
        data: [...communities.data, createdCommunity],
        count: communities.count + 1,
      })
    } else {
      setCommunities({
        data: [...communities.data],
        count: communities.count + 1,
      })
    }

    loading.setAttribute("style", "display:none;")
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

              <button type="submit">Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox
            title="Seguidores"
            urlBase="/usuarios/"
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
            title="Seguindo"
            urlBase="/usuarios/"
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
            title="Comunidades"
            urlBase="/comunidades/"
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
      <div className="loading">
        <img
          src="https://media.giphy.com/media/XYoVdV12UXizl7bNvL/giphy.gif"
          alt="Loading"
        />
      </div>
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
    getUserInfo(githubUser),
  ]).then((results) => {
    if (results[3]?.statusError) {
      return {
        statusError: results[3].statusError,
      }
    }
    return {
      followers: results[0] || [],
      following: results[1] || [],
      communities: {
        data: results[2].data.allCommunities || [],
        count: results[2].data._allCommunitiesMeta.count,
      },
      userInfo: results[3],
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
