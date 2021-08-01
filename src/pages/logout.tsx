import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import nookies from "nookies"
import { clearInterval } from "timers"

export default function logoutPage(props) {
  const route = useRouter()
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    if (seconds > 1) {
      setTimeout(function () {
        setSeconds(seconds - 1)
      }, 1000)
    } else {
      nookies.destroy(null, "USER_TOKEN")
      route.push("/login")
    }
  }, [seconds])

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Você será redirecionado em {seconds}...
    </div>
  )
}
