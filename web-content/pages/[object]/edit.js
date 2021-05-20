import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';

import styles from '../../styles/Edit.module.css';

export default function QuizEdit() {
  const router = useRouter()
  const object = router.query.object;
  const subjectId = parseInt(router.query.sId);
  const categoryId = parseInt(router.query.cId);
  const subTopicId = parseInt(router.query.stId);
  const objectId = parseInt(router.query.id);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to {router.query.object} Edit page.
        </h1>
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