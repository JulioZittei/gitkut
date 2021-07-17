import styled from "styled-components"
import { Box } from "../Box"

export function ProfileSidebar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        alt={props.githubUser}
        style={{ borderRadius: "8px" }}
      />
    </Box>
  )
}
