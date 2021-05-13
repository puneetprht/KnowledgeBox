import Link from 'next/link'
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';

import styles from '../../styles/Object.module.css';

export default function Objects({user}) {
  const router = useRouter()
  return (
    <div className={styles.wrapper}>
      <Link href={`/${router.query.object}/topic?i=' + ${12}`}><a>Go to topics page.</a></Link>
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

export async function getServerSideProps(ctx){
  const {user} = parseCookies(ctx)
  if(!user){
      const {res} = ctx
      res.writeHead(302,{Location:"/"})
      res.end()
  }
  return {props: {user: user || {}}};
}

