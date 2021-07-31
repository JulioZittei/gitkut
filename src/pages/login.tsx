import Head from "next/head"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import nookies from "nookies"

export default function LoginPage() {
  const router = useRouter()
  const [githubUser, setGithubUser] = useState("")

  return (
    <>
      <Head>
        <title>GitKut | Login</title>
      </Head>
      <main
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loginScreen">
          <section className="logoArea">
            <img src="/images/logo.png" alt="Logotipo do GitKut" />

            <p>
              <strong>Conecte-se</strong> aos seus amigos e familiares usando
              recados e mensagens instantâneas
            </p>
            <p>
              <strong>Conheça</strong> novas pessoas através de amigos de seus
              amigos e comunidades
            </p>
            <p>
              <strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só
              lugar
            </p>
          </section>

          <section className="formArea">
            <form
              className="box"
              onSubmit={(e) => {
                e.preventDefault()
                fetch("https://alurakut.vercel.app/api/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ githubUser: githubUser }),
                }).then(async (response) => {
                  const data = await response.json()
                  const token = data.token
                  nookies.set(null, "USER_TOKEN", token, {
                    path: "/",
                    maxAge: 86400 * 7,
                  })
                  router.push("/", undefined, { shallow: true })
                })
              }}
            >
              <p>
                Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
              </p>
              <input
                placeholder="Usuário"
                required
                value={githubUser}
                onChange={(e) => {
                  setGithubUser(e.target.value)
                }}
              />

              <button type="submit">Login</button>
            </form>

            <footer className="box">
              <p>
                Ainda não é membro? <br />
                <a href="/login">
                  <strong>ENTRAR JÁ</strong>
                </a>
              </p>
            </footer>
          </section>

          <footer className="footerArea">
            <p>
              © 2021 gitkut.vercel.app - <a href="/about">Sobre o GitKut</a> -{" "}
              <a href="/privacy">Privacidade</a> - <a href="/terms">Termos</a> -{" "}
              <a href="/contact">Contato</a>
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
