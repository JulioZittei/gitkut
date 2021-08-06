import { slugfy } from "../../utils/GitKutUtils"
import { Link } from "../Link"
import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

type ProfileRelationsBoxProps = {
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
              <Link href={`${urlBase}${item[props.slug]}`}>
                <img src={`${item[props.imageUrl]}`} alt={item[props.title]} />
                <span>{item[props.title]}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <hr />

      <Link className="boxLink" href={`/${title.toLocaleLowerCase()}/`}>
        Ver todos
      </Link>
    </ProfileRelationsBoxWrapper>
  )
}
