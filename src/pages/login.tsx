import Head from "next/head"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import nookies from "nookies"

export default function LoginPage() {
  const router = useRouter()
  const [githubUser, setGithubUser] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
                setIsLoading(true)
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
                  router.push("/")
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
                  setGithubUser(e.target.value.trim().toLocaleLowerCase())
                }}
              />

              {router.query?.userDoesNotExists === "" && (
                <span
                  style={{
                    fontSize: "13px",
                    color: "red",
                    marginBottom: "12px",
                  }}
                >
                  Usuário não existe! Tente novamente.
                </span>
              )}

              {router.query?.rateLimit === "" && (
                <span
                  style={{
                    fontSize: "13px",
                    color: "red",
                    marginBottom: "12px",
                  }}
                >
                  Você atingiu o limite de tentativas! Tente novamente mais
                  tarde.
                </span>
              )}

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
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
