import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';

import styles from '../../../styles/Topic.module.css';

export default function Topic({user}) {
  const router = useRouter()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
          Welcome to {router.query.object} Topic page. {router.query.i}
      </h1>
      <Link href={`/${router.query.object}/topic/list`}><a>Go to List page.</a></Link>
      <main className={styles.container}>
        <div className={styles.leftModule}>
          <p>This will display complete list.</p>
        </div>
        <div className={styles.rightModule}>
          <p>Stats would be shown here.</p>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(ctx){
  const {user} = parseCookies(ctx)
  if(!user){
      const {res} = ctx
      res.writeHead(302,{Location:"/"})
      res.end()
  }
  return {props: {user: user || {}}};
}
