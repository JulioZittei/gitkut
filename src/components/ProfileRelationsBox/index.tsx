import { slugfy } from "../../utils/GitKutUtils"
import { Link } from "../Link"
import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

type ProfileRelationsBoxProps = {
  githubUser: string
  title: string
  urlBase: string
  totalItems: number
  items: Array<any>
  props: {
    id: string
    title: string
    slug: string
    imageUrl: string
  }
}

export function ProfileRelationsBox({
  githubUser,
  title,
  urlBase,
  totalItems,
  items,
  props,
}: ProfileRelationsBoxProps) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} <span>({totalItems})</span>
      </h2>
      <ul>
        {items.map((item) => {
          return (
            <li key={item[props.id]}>
              <Link
                href={`${
                  title.toLocaleLowerCase() == "comunidades"
                    ? `/communities`
                    : `/${item[props.slug]}`
                }${
                  title.toLocaleLowerCase() == "comunidades"
                    ? `/${item[props.slug]}`
                    : `${urlBase}`
                }`}
              >
                <img src={`${item[props.imageUrl]}`} alt={item[props.title]} />
                <span>{item[props.title]}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <hr />

      {title.toLocaleLowerCase() == "seguidores" && (
        <Link className="boxLink" href={`/${githubUser}/followers`}>
          Ver todos
        </Link>
      )}

      {title.toLocaleLowerCase() == "seguindo" && (
        <Link className="boxLink" href={`/${githubUser}/following`}>
          Ver todos
        </Link>
      )}

      {title.toLocaleLowerCase() == "comunidades" && (
        <Link className="boxLink" href={`/${githubUser}/communities`}>
          Ver todos
        </Link>
      )}

      {title.toLocaleLowerCase() == "membros" && (
        <Link className="boxLink" href={`/communities/${githubUser}/members`}>
          Ver todos
        </Link>
      )}
    </ProfileRelationsBoxWrapper>
  )
}
