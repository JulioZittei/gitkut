import React, { useState } from "react"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import { Link } from "../../../components/Link"
import { GitkutMenu } from "../../../components/GitKutMenu"
import { MainGrid } from "../../../components/MainGrid"
import { Box } from "../../../components/Box"
import { getFollowers, getUserInfo } from "../../../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Post } from "../../../components/Post"
import Head from "next/head"
import { ProfileSidebar } from "../../../components/ProfileSidebar"

export default function UserFriends({ data }) {
  const [followers, setFollowers] = useState(data.followers)

  const theme = {
    grid: 2,
  }

  return (
    <>
      <Head>
        <title>Amigos de {data.userInfo.name}</title>
      </Head>
      <GitkutMenu userInfo={data.userInfo} />
      <MainGrid theme={theme}>
        <div className="profileArea">
          <ProfileSidebar userInfo={data.userInfo} />
        </div>

        <div className="welcomeArea">
          <Box>
            <h1 className="title subPageTitle">Amigos</h1>
            <p className="pathSubtitle">
              Início &#62; <span>Amigos</span>
            </p>
            <hr />
            {followers.length < 1 ? (
              <span className="noScrap">Você ainda não possui amigos!</span>
            ) : (
              <ul>
                {followers.map((follower) => {
                  return (
                    <Post key={follower.id}>
                      <Link href={`/${follower.login}`}>
                        <img src={follower.avatar_url} />
                      </Link>
                      <div>
                        <span>{follower.login}</span>
                        <p>{follower?.name}</p>
                      </div>
                    </Post>
                  )
                })}
              </ul>
            )}
          </Box>
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
    getFollowers(githubUser),
    getUserInfo(githubUser),
  ]).then((results) => {
    if (results[1]?.statusError) {
      return {
        statusError: results[1].statusError,
      }
    }

    return {
      followers: results[0],
      userInfo: results[1],
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
