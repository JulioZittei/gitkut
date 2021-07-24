import { useEffect, useState } from "react"
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
  transformData,
  slugfy,
} from "../utils/GitKutUtils"
import Head from "next/head"

export async function getServerSideProps(context) {
  const githubUser = "juliozittei"
  const data = await Promise.all([
    getFollowers(githubUser),
    getFollowing(githubUser),
    getUserInfo(githubUser),
  ])
    .then((results) => {
      return {
        followers: transformData(results[0] || []),
        following: transformData(results[1] || []),
        userInfo: results[2],
      }
    })
    .catch((error) => {
      console.log("Error message:", error.message)
    })

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}

export default function Home(props) {
  const { data } = props
  const [userInfo, setUserInfo] = useState(data?.userInfo)
  const [following, setFollowing] = useState(data?.following || [])
  const [followers, setFollowers] = useState(data?.followers || [])
  const [communities, setCommunities] = useState([])

  function handleCreateCommunity(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const desc = formData.get("name")
    const imageUrl = formData.get("imageUrl")
    const urlLink = formData.get("name").toString()
    const community = {
      desc,
      imageUrl,
      urlLink: `/comunidades/${slugfy(urlLink)}`,
    }
    setCommunities([...communities, community])
    event.target.reset()
  }

  return (
    <>
      <Head>
        <title>GitKut | A rede social baseada no GitHub</title>
      </Head>

      <GitkutMenu userInfo={userInfo} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar userInfo={userInfo} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>
            <blockquote cite={`https://github.com/${userInfo?.login}`}>
              <q>{userInfo?.bio}</q>
            </blockquote>
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
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Coloque uma URL para usarmos de capa."
                aria-label="Coloque uma URL para usarmos de capa."
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
            totalItems={userInfo?.followers}
            items={followers}
          />

          <ProfileRelationsBox
            title="Seguindo"
            totalItems={userInfo?.following}
            items={following}
          />

          <ProfileRelationsBox
            title="Comunidades"
            totalItems={communities.length}
            items={communities}
          />
        </div>
      </MainGrid>
    </>
  )
}
