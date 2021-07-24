import { Link } from "../Link"
import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

type ProfileRelationsBoxProps = {
  title: string
  totalItems: number
  items: Array<any>
}

export function ProfileRelationsBox({
  title,
  totalItems,
  items,
}: ProfileRelationsBoxProps) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} <span>({totalItems})</span>
      </h2>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.desc}>
              <Link href={item.urlLink}>
                <img src={`${item.imageUrl}`} alt={item.desc} />
                <span>{item.desc}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}
