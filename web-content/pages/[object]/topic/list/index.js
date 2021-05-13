import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';

import styles from '../../../../styles/List.module.css';

export default function List({user}) {
  const router = useRouter()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Welcome to {router.query.object} Topics page.
      </h1>
      <p>From here we bi-fercate to separate pages.</p>
      {router.query.object == 'test' || router.query.object == 'quiz'? <Link href={`/${router.query.object}/edit`}><a>Edit</a></Link>:<></>} 
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
