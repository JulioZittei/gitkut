import Head from "next/head"
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
} from "../../utils/GitKutUtils"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

export default function UserPage({ data }) {
  const [userInfo, setUserInfo] = useState(data.userInfo)
  const [following, setFollowing] = useState(data.following)
  const [followers, setFollowers] = useState(data.followers)
  const [communities, setCommunities] = useState(data?.communities)

  useEffect(() => {
    setUserInfo(data.userInfo)
    setFollowers(data.followers)
    setFollowing(data.following)
    setCommunities(data.communities)
  }, [data])

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
            <h1 className="title">{userInfo.name}</h1>
            {userInfo.bio && userInfo.bio !== "" && (
              <blockquote cite={`https://github.com/${userInfo.login}`}>
                <q>{userInfo?.bio}</q>
              </blockquote>
            )}
            <OrkutNostalgicIconSet />
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

          <Box></Box>
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
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const githubUser = context.query.slug as string

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

  if (data?.statusError === 404 || data?.statusError === 403) {
    return {
      notFound: true,
    }
  }

  console.log(data)

  return {
    props: { data }, // will be passed to the page component as props
  }
}
