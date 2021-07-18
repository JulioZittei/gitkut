import { useEffect, useState } from "react"
import { Box } from "../components/Box"
import { MainGrid } from "../components/MainGrid"
import { ProfileRelationsBoxWrapper } from "../components/ProfileRelations"
import { ProfileSidebar } from "../components/ProfileSidebar"
import { GitkutMenu } from "../components/GitKutMenu"
import { OrkutNostalgicIconSet } from "../components/OrkutNostalgicIconSet"
import { Link } from "../components/Link"

export default function Home() {
  const githubUser = "juliozittei"
  const [friends, setFriends] = useState([])

  async function getFollowers() {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/followers`
    )
    const data = await response.json()
    setFriends(data)
  }

  useEffect(() => {
    getFollowers()
  }, [])

  return (
    <>
      <GitkutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Meus seguidores <span>({friends.length})</span>
            </h2>
            <ul>
              {friends.map((friend) => {
                return (
                  <li key={friend.login}>
                    <Link href={`/users/${friend.login}`}>
                      <img
                        src={`https://github.com/${friend.login}.png`}
                        alt={friend.login}
                      />
                      <span>{friend.login}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box>
            <h2 className="smallTitle">
              Comunidades <span>(0)</span>
            </h2>
          </Box>
        </div>
      </MainGrid>
    </>
  )
}
