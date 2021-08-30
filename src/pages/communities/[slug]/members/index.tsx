import React, { useState } from "react"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import { Link } from "../../../../components/Link"
import {
  GitkutMenu,
  GitkutProfileSidebarMenuDefault,
} from "../../../../components/GitKutMenu"
import { MainGrid } from "../../../../components/MainGrid"
import { Box } from "../../../../components/Box"
import { getCommunity, getUserInfo } from "../../../../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Post } from "../../../../components/Post"
import Head from "next/head"
import { ProfileSidebar } from "../../../../components/ProfileSidebar"

export default function CommunityMembersPage({ data }) {
  const [community, setCommunity] = useState(data.community)
  const [userInfo, setUserInfo] = useState(data.userInfo)

  const [isMember, setIsMember] = useState(
    community.members.some(
      (member) => member.userId === userInfo.login.toLowerCase()
    )
  )
  const [isLoading, setIsLoading] = useState(false)

  async function handleJoinCommunity(e) {
    e.preventDefault()
    let updatedCommunity = null

    const member = {
      user: userInfo,
      communityId: community.id,
    }

    if (!isMember) {
      setIsLoading(true)
      try {
        updatedCommunity = await fetch("/api/communities", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(member),
        }).then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
      } catch (error) {
        console.log(`${error.message}`)
      }

      setCommunity({
        ...community,
        members: JSON.parse(updatedCommunity.members),
        _createdAt: updatedCommunity.meta.createdAt,
      })
      setIsMember(true)
      setIsLoading(false)
    } else {
      setIsLoading(true)
      try {
        await fetch("/api/communities", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(member),
        })
      } catch (error) {
        console.log(`${error.message}`)
      }

      const oldMembers = community.members
      const members = oldMembers.filter(
        (member) => member.userId !== userInfo.login.toLowerCase()
      )

      setCommunity({
        ...community,
        members: members,
      })

      setIsMember(false)
      setIsLoading(false)
    }
  }

  const theme = {
    grid: 2,
  }

  return (
    <>
      <Head>
        <title>{community.title} | Membros</title>
      </Head>
      <GitkutMenu userInfo={data.userInfo} />
      <MainGrid theme={theme}>
        <div className="profile-area">
          <Box as="aside">
            <img
              className="communityImg"
              src={community.imageUrl}
              style={{ borderRadius: "8px" }}
            />

            <hr />
            <p>
              <a
                className="boxLink community"
                href={`/communities/${community.slug}`}
              >
                {community.title}
              </a>
            </p>
            <hr />

            <GitkutProfileSidebarMenuDefault
              handleJoinCommunity={handleJoinCommunity}
              isCommunityInfo={true}
              isMember={isMember}
              isLoading={isLoading}
              userInfo={data.userInfo}
            />
          </Box>
        </div>

        <div className="welcomeArea">
          <Box>
            <h1 className="title subPageTitle">Membros da Comunidade</h1>
            <p className="pathSubtitle">
              Início &#62; Comunidades &#62; {community.title} &#62;{" "}
              <span>Membros</span>
            </p>
            <hr />
            {community.members.length < 1 ? (
              <span className="noScrap">Não há comunidades criadas</span>
            ) : (
              <ul>
                {community.members.map((member) => {
                  return (
                    <Post key={member.userId}>
                      <Link href={`/${member.userId}`}>
                        <img src={member.imageUrl} />
                      </Link>
                      <div>
                        <span>{member.userId}</span>
                        <Link
                          href={`https://github.com/${member.userId}`}
                          className="githubLink"
                          target="_blank"
                        >
                          <p>{`https://github.com/${member.userId}`}</p>
                        </Link>
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
  const decodedToken = jwt.decode(token)
  const githubUser = decodedToken?.githubUser
  const slug = context.query.slug as string

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
    getCommunity(slug),
    getUserInfo(githubUser),
  ]).then((results) => {
    return {
      community: results[0].data.community,
      userInfo: results[1],
    }
  })

  return {
    props: { data }, // will be passed to the page component as props
  }
}
