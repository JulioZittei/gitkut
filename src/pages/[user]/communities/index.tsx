import { GetServerSideProps, GetServerSidePropsContext } from "next"

export default function CommunitiesPage({ githubUser }) {
  return <div>Comunidades do Usuário {githubUser}</div>
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const githubUser = (context.query.user as string).toLocaleLowerCase()

  // const data = await Promise.all([
  //   getFollowers(githubUser),
  //   getFollowing(githubUser),
  //   getCommunities(githubUser),
  //   getPosts(githubUser),
  //   getUserInfo(githubUser),
  // ]).then((results) => {
  //   if (results[4]?.statusError) {
  //     return {
  //       statusError: results[4].statusError,
  //     }
  //   }
  //   return {
  //     followers: results[0] || [],
  //     following: results[1] || [],
  //     communities: {
  //       data: results[2].data.allCommunities || [],
  //       count: results[2].data._allCommunitiesMeta.count,
  //     },
  //     posts: results[3].data.allPosts,
  //     userInfo: results[4],
  //   }
  // })

  // if (data?.statusError === 404 || data?.statusError === 403) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    props: {
      githubUser,
    }, // will be passed to the page component as props
  }
}
