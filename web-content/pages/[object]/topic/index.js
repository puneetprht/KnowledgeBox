import Link from 'next/link'
import {useRouter} from 'next/router'
import styles from '../../../styles/Home.module.css'

export default function Topic() {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to {router.query.object} Topics page.
        </h1>
        <p>go to <Link href={`/${router.query.object}/topic/list`}><a>List</a></Link> page.</p>
      </main>
    </div>
  )
}
