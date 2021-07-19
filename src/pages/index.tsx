import { FormEvent, useEffect, useState } from "react"
import { Box } from "../components/Box"
import { MainGrid } from "../components/MainGrid"
import { ProfileRelationsBoxWrapper } from "../components/ProfileRelations"
import { ProfileSidebar } from "../components/ProfileSidebar"
import { GitkutMenu } from "../components/GitKutMenu"
import { OrkutNostalgicIconSet } from "../components/OrkutNostalgicIconSet"
import { Link } from "../components/Link"
import Head from "next/Head"

export default function Home() {
  const githubUser = "juliozittei"
  const [userInfo, setUserInfo] = useState<any>({})
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [communities, setCommunities] = useState([])

  async function getUserInfo() {
    const response = await fetch(`https://api.github.com/users/${githubUser}`)
    const data = await response.json()
    setUserInfo(data)
  }

  async function getFollowers() {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/followers?per_page=6`
    )
    const data = await response.json()
    setFollowers(data)
  }

  async function getFollowing() {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/following?per_page=6`
    )
    const data = await response.json()
    setFollowing(data)
  }

  function handleCreateCommunity(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const community = {
      name: formData.get("name"),
      imageUrl: formData.get("imageUrl"),
    }
    setCommunities([...communities, community])
    event.target.reset()
  }

  useEffect(() => {
    Promise.all([getFollowers(), getFollowing(), getUserInfo()])
  }, [])

  return (
    <>
      <Head>
        <title>GitKut | A rede social baseada no GitHub</title>
      </Head>

      <GitkutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar userInfo={userInfo} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>

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
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Seguidores <span>({userInfo.followers})</span>
            </h2>
            <ul>
              {followers.map((follower) => {
                return (
                  <li key={follower.login}>
                    <Link href={`/users/${follower.login}`}>
                      <img
                        src={`https://github.com/${follower.login}.png`}
                        alt={follower.login}
                      />
                      <span>{follower.login}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Seguindo <span>({userInfo.following})</span>
            </h2>
            <ul>
              {following.map((followed) => {
                return (
                  <li key={followed.login}>
                    <Link href={`/users/${followed.login}`}>
                      <img
                        src={`https://github.com/${followed.login}.png`}
                        alt={followed.login}
                      />
                      <span>{followed.login}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades <span>({communities.length})</span>
            </h2>
            <ul>
              {communities.map((community) => {
                return (
                  <li key={community.name}>
                    <Link href={`/comunidades/${community.name}`}>
                      <img src={`${community.imageUrl}`} alt={community.name} />
                      <span>{community.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
