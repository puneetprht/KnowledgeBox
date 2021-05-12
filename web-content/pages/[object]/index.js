import Link from 'next/link'
import {useRouter} from 'next/router'
import styles from '../../styles/Object.module.css'

export default function Objects() {
  const router = useRouter()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
          Welcome to {router.query.object} page.
      </h1>
      <Link href={`/${router.query.object}/topic`}><a>Go to topics page.</a></Link>
      <div className={styles.dropdown}>
        <p>This will show dropdown on small screen.</p>
      </div>
      <main className={styles.container}>
        <div className={styles.leftModule}>
          <p>This is for Dropdown/category selection</p>
        </div>
        <div className={styles.centerModule}>
          <p>This will display complete list.</p>
        </div>
        <div className={styles.rightModule}>
          <p>Stats would be shown here.</p>
        </div>
      </main>
    </div>
  )
}
