import { Box } from "../Box"
import { Link } from "../Link"
import { GitkutProfileSidebarMenuDefault } from "../GitKutMenu"

type ProfileSidebarProps = {
  userInfo: any
}

export function ProfileSidebar(props: ProfileSidebarProps) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.userInfo.login}.png`}
        alt={props.userInfo.login}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <Link
        className="boxLink"
        href={`https://github.com/${props.userInfo.login}`}
      >
        {props.userInfo.name}
      </Link>
      <hr />

      <GitkutProfileSidebarMenuDefault />
    </Box>
  )
}
