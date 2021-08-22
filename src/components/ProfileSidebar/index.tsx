import { Box } from "../Box"
import { Link } from "../Link"
import { GitkutProfileSidebarMenuDefault } from "../GitKutMenu"

type ProfileSidebarProps = {
  userInfo: any
}

export function ProfileSidebar({ userInfo }: ProfileSidebarProps) {
  return (
    <Box as="aside">
      <img
        src={userInfo?.avatar_url}
        alt={userInfo?.login}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <Link className="boxLink" href={`/usuarios/${userInfo?.login}`}>
        {userInfo?.name}
      </Link>
      <hr />

      <GitkutProfileSidebarMenuDefault
        isCommunityInfo={false}
        handleJoinCommunity={undefined}
        isMember={undefined}
        isLoading={undefined}
      />
    </Box>
  )
}
