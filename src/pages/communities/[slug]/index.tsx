import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import nookies from "nookies"
import jwt from "jsonwebtoken"
import {
  GitkutMenu,
  GitkutProfileSidebarMenuDefault,
} from "../../../components/GitKutMenu"
import { MainGrid } from "../../../components/MainGrid"
import { Box } from "../../../components/Box"
import { InfoBox } from "../../../components/InfoBox"
import { ProfileRelationsBox } from "../../../components/ProfileRelationsBox"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getCommunity, getUserInfo } from "../../../utils/GitKutUtils"
import Head from "next/head"

export default function CommunityPage({ data }) {
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

  return (
    <>
      <Head>
        <title>Comunidade | {community.title}</title>
      </Head>
      <GitkutMenu userInfo={data.userInfo} />
      <MainGrid>
        <div className="profile-area">
          <Box as="aside">
            <img
              className="communityImg"
              src={community.imageUrl}
              style={{ borderRadius: "8px" }}
            />

            <hr />
            <p>
              <a className="boxLink community" href={`#`} target="_blank">
                {community.title}
              </a>
            </p>
            <hr />

            <GitkutProfileSidebarMenuDefault
              handleJoinCommunity={handleJoinCommunity}
              isCommunityInfo={true}
              isMember={isMember}
              isLoading={isLoading}
            />
          </Box>
        </div>
        <div className="welcome-area">
          <Box>
            <h1 className="title subPageTitle">{community.title}</h1>
            <p className="pathSubtitle">
              Início &#62; Comunidades <span>&#62; {community.title}</span>
            </p>
            <hr />
            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnCenter">Criador:</td>
                  <td>{community.creatorId}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Criado em:</td>
                  <td>{new Date(community._createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Categoria:</td>
                  <td>{community.category}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Tipo:</td>
                  <td>{community.communityType}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Idioma:</td>
                  <td>{community.language}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Região:</td>
                  <td>{community.location}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Membros:</td>
                  <td>{community.members.length}</td>
                </tr>
              </tbody>
            </InfoBox>
          </Box>
        </div>
        <div className="profile-relation-area">
          <ProfileRelationsBox
            githubUser={community.slug}
            title="Membros"
            urlBase=""
            totalItems={community.members.length}
            items={community.members.slice(0, 5)}
            props={{
              id: "userId",
              title: "userId",
              slug: "userId",
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
