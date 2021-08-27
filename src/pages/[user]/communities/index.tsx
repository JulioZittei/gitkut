import React, { useState } from "react"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import { Link } from "../../../components/Link"
import { GitkutMenu } from "../../../components/GitKutMenu"
import { MainGrid } from "../../../components/MainGrid"
import { Box } from "../../../components/Box"
import {
  getCommunities,
  getFollowers,
  getUserInfo,
} from "../../../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Post } from "../../../components/Post"
import Head from "next/head"
import { ProfileSidebar } from "../../../components/ProfileSidebar"

export default function UserCommunities({ data }) {
  const [communities, setCommunities] = useState(data.communities.data)

  const theme = {
    grid: 2,
  }

  return (
    <>
      <Head>
        <title>Comunidades</title>
      </Head>
      <GitkutMenu userInfo={data.userInfo} />
      <MainGrid theme={theme}>
        <div className="profileArea">
          <ProfileSidebar userInfo={data.userInfo} />
        </div>

        <div className="welcomeArea">
          <Box>
            <h1 className="title subPageTitle">Comunidades</h1>
            <p className="pathSubtitle">
              Início &#62; <span>Comunidades</span>
            </p>
            <hr />
            {communities.length < 1 ? (
              <span className="noScrap">Não há comunidades criadas</span>
            ) : (
              <ul>
                {communities.map((community) => {
                  return (
                    <Post key={community.id}>
                      <Link href={`/communities/${community.slug}`}>
                        <img src={community.imageUrl} />
                      </Link>
                      <div>
                        <span>{community.title}</span>
                        <p>Criador: {community.creatorId}</p>
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
    getCommunities(),
    getUserInfo(githubUser),
  ]).then((results) => {
    let fetchedData = []

    if (results[1]?.statusError) {
      return {
        statusError: results[1].statusError,
      }
    }

    fetchedData = results[0].data.allCommunities.filter((community) => {
      if (community.members.some((member) => member.userId === githubUser)) {
        return community
      }
    })

    return {
      communities: {
        data: fetchedData.slice(0, 6) || [],
        count: fetchedData.length,
      },
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
