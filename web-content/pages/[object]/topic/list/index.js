import Link from 'next/link'
import {useRouter} from 'next/router'
import styles from '../../../../styles/Home.module.css'

export default function List() {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to {router.query.object} Topics page.
        </h1>
        <p>From here we bi-fercate to separate pages.</p>
        {router.query.object == 'test' || router.query.object == 'quiz'? <Link href={`/${router.query.object}/edit`}><a>Edit</a></Link>:<></>} 
      </main>
    </div>
  )
}
