import styled from "styled-components"

export const MainGrid = styled.main`
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px;
  grid-gap: 10px;

  .profileArea {
    display: none;
    @media (min-width: 860px) {
      display: block;
    }
  }

  @media (min-width: 860px) {
    max-width: 1110px;
    display: grid;
    grid-template-areas: ${(props) =>
      props.theme?.grid === 2
        ? ""
        : "profileArea welcomeArea profileRelationsArea"};
    grid-template-columns: ${(props) =>
      props.theme?.grid === 2 ? "160px 1fr" : "160px 1fr 312px"};
  }
`
