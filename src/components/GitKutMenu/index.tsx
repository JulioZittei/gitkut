import { useEffect, useState } from "react"
import styled from "styled-components"
import { Link } from "../Link"
import nookies from "nookies"

// ================================================================================================================
// Menu
// ================================================================================================================
export function GitkutMenu({ userInfo }) {
  const [isMenuOpen, setMenuState] = useState(false)

  return (
    <GitkutMenu.Wrapper isMenuOpen={isMenuOpen}>
      <div className="container">
        <GitkutMenu.Logo src="/images/logo.png" alt="Logo do Gitkut" />

        <nav style={{ flex: 1 }}>
          {[
            { name: "Inicio", slug: `/` },
            {
              name: "Amigos",
              slug: `/${userInfo.login.toLowerCase()}/friends`,
            },
            {
              name: "Comunidades",
              slug: `/communities`,
            },
          ].map((menuItem) => (
            <Link
              key={`key__${menuItem.name.toLocaleLowerCase()}`}
              href={`${menuItem.slug.toLocaleLowerCase()}`}
            >
              {menuItem.name}
            </Link>
          ))}
        </nav>

        <nav>
          <Link href={`/logout`}>Sair</Link>
          <div>
            <input placeholder="Pesquisar no Gitkut" />
          </div>
        </nav>

        <button onClick={() => setMenuState(!isMenuOpen)}>
          {isMenuOpen && <img src="/icons/menu-open.svg" alt="menu" />}
          {!isMenuOpen && <img src="/icons/menu-closed.svg" alt="close" />}
        </button>
      </div>
      <GitkutMenuProfileSidebar userInfo={userInfo} />
    </GitkutMenu.Wrapper>
  )
}
GitkutMenu.Wrapper = styled.header<{
  isMenuOpen: boolean
}>`
  width: 100%;
  background-color: #308bc5;

  .GitkutMenuProfileSidebar {
    background: white;
    position: fixed;
    z-index: 100;
    padding: 46px;
    bottom: 0;
    left: 0;
    right: 0;
    top: 48px;
    transition: 0.3s;
    pointer-events: ${({ isMenuOpen }) => (isMenuOpen ? "all" : "none")};
    opacity: ${({ isMenuOpen }) => (isMenuOpen ? "1" : "0")};
    transform: ${({ isMenuOpen }) =>
      isMenuOpen ? "translateY(0)" : "translateY(calc(-100% - 48px))"};
    @media (min-width: 860px) {
      display: none;
    }
    > div {
      max-width: 400px;
      margin: auto;
    }
    a {
      font-size: 18px;
    }
    .boxLink {
      font-size: 18px;
      color: #2e7bb4;
      -webkit-text-decoration: none;
      text-decoration: none;
      font-weight: 800;
    }

    hr {
      margin-top: 12px;
      margin-bottom: 8px;
      border-color: transparent;
      border-bottom-color: #ecf2fa;
    }
  }

  .container {
    background-color: #308bc5;
    padding: 7px 16px;
    max-width: 1110px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 101;
    @media (min-width: 860px) {
      justify-content: flex-start;
    }

    button {
      border: 0;
      background: transparent;
      align-self: center;
      display: inline-block;
      @media (min-width: 860px) {
        display: none;
      }
    }

    nav {
      display: none;
      @media (min-width: 860px) {
        display: flex;
      }
      a {
        font-size: 12px;
        color: white;
        padding: 10px 16px;
        position: relative;
        text-decoration: none;
        &:not([href="/"]):after {
          content: " ";
          background-color: #5292c1;
          display: block;
          position: absolute;
          width: 1px;
          height: 12px;
          margin: auto;
          left: 0;
          top: 0;
          bottom: 0;
        }
      }
    }
    input {
      color: #ffffff;
      background: #5579a1;
      padding: 10px 42px;
      border: 0;
      background-image: url("/icons/search.svg");
      background-position: 15px center;
      background-repeat: no-repeat;
      border-radius: 1000px;
      font-size: 12px;
      ::placeholder {
        color: #ffffff;
        opacity: 1;
      }
    }
  }
`
GitkutMenu.Logo = styled.img`
  background-color: #ffffff;
  padding: 9px 16px;
  border-radius: 1000px;
  height: 34px;
`

function GitkutMenuProfileSidebar({ userInfo }) {
  return (
    <div className="GitkutMenuProfileSidebar">
      <div>
        <img
          src={`https://github.com/${userInfo.login}.png`}
          style={{ borderRadius: "8px" }}
        />
        <hr />
        <p>
          <Link className="boxLink" href={`/user/${userInfo.login}`}>
            @{userInfo.login}
          </Link>
        </p>
        <hr />

        <GitkutProfileSidebarMenuDefault
          isCommunityInfo={false}
          handleJoinCommunity={undefined}
          isMember={undefined}
          isLoading={undefined}
          userInfo={userInfo}
        />
      </div>
    </div>
  )
}

// ================================================================================================================
// GitkutProfileSidebarMenuDefault
// ================================================================================================================
export function GitkutProfileSidebarMenuDefault({
  isCommunityInfo,
  handleJoinCommunity,
  isMember,
  isLoading,
  userInfo,
}) {
  return (
    <GitkutProfileSidebarMenuDefault.Wrapper>
      {!isCommunityInfo ? (
        <>
          <nav>
            <Link href={`/${userInfo?.login}`}>
              <img src="/icons/user.svg" />
              Perfil
            </Link>
            <Link href={`/${userInfo?.login}`}>
              <img src="/icons/book.svg" />
              Posts
            </Link>
            <Link href={`/${userInfo?.login}`}>
              <img src="/icons/camera.svg" />
              Fotos
            </Link>
            <Link href={`/${userInfo?.login}`}>
              <img src="/icons/sun.svg" />
              Depoimentos
            </Link>
          </nav>
          <hr />
          <nav>
            <Link href={`${userInfo?.html_url}`} target="_blank">
              <img src="/icons/plus.svg" />
              GitHub Trends
            </Link>
            <Link href="/logout">
              <img src="/icons/logout.svg" />
              Sair
            </Link>
          </nav>
        </>
      ) : (
        <>
          <nav>
            <button
              className="plusButton"
              onClick={(e) => handleJoinCommunity(e)}
              disabled={isLoading}
            >
              <img src={isMember ? `/icons/logout.svg` : `/icons/plus.svg`} />
              {isMember ? "Deixar comunidade" : "Participar da comunidade"}
            </button>
          </nav>
        </>
      )}
    </GitkutProfileSidebarMenuDefault.Wrapper>
  )
}
GitkutProfileSidebarMenuDefault.Wrapper = styled.div`
  a {
    font-size: 12px;
    color: #2e7bb4;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-decoration: none;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }

  .plusButton {
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    text-align: left;
    font-size: 12px;
    color: #2e7bb4;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &:disabled {
      cursor: not-allowed;
    }
    img {
      display: inline;
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
`
