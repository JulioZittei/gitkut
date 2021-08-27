import React, { useState } from "react"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import { Link } from "../../../components/Link"
import { GitkutMenu } from "../../../components/GitKutMenu"
import { MainGrid } from "../../../components/MainGrid"
import { Box } from "../../../components/Box"
import { getFollowing, getUserInfo } from "../../../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Post } from "../../../components/Post"
import Head from "next/head"
import { ProfileSidebar } from "../../../components/ProfileSidebar"

export default function UserFollowingPage({ data }) {
  const [following, setfollowing] = useState(data.following)

  const theme = {
    grid: 2,
  }

  return (
    <>
      <Head>
        <title>Seguindo de {data.userInfo.name}</title>
      </Head>
      <GitkutMenu userInfo={data.userInfo} />
      <MainGrid theme={theme}>
        <div className="profileArea">
          <ProfileSidebar userInfo={data.userInfo} />
        </div>

        <div className="welcomeArea">
          <Box>
            <h1 className="title subPageTitle">Seguindo</h1>
            <p className="pathSubtitle">
              Início &#62; {data.userInfo.name} &#62; <span>Seguindo</span>
            </p>
            <hr />
            {following.length < 1 ? (
              <span className="noScrap">Você ainda não segue ninguém!</span>
            ) : (
              <ul>
                {following.map((follower) => {
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
    getFollowing(githubUser),
    getUserInfo(githubUser),
  ]).then((results) => {
    if (results[1]?.statusError) {
      return {
        statusError: results[1].statusError,
      }
    }

    return {
      following: results[0],
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
