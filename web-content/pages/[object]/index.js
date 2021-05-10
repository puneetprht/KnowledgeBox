import {useRouter} from 'next/router'
import styles from '../../styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to {router.query.object} page.
        </h1>
      </main>
    </div>
  )
}
