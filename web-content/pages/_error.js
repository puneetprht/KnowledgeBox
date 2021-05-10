import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from '../styles/Error.module.css'

function Error({ statusCode }) {
    const router = useRouter();
    //router.replace('/');

    return (
        <div className={styles.container}>
          <div className={styles.heading}>
            <Image
              src="/icon.png"
              width={60}
              height={60}
            />
          </div>
          <div className={styles.headingDiv}>
            <h2 className={styles.heading2}>Oops sorry, we're working on it.</h2>
          </div>
        </div>
    )
  }
  
  Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
  
  export default Error