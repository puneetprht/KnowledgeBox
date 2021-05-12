import Link from 'next/link';
import Image from 'next/image';
import cookie from 'js-cookie';
import {useState} from 'react';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';

import styles from '../../styles/Navbar.module.css';

const NavBar = () => {
    const router = useRouter();
    const cookieuser = parseCookies();
    const user =  cookieuser.user ? JSON.parse(cookieuser.user) : "";
    const [mode, setMode] = useState(false);

    const  isActive = (route) => {
      if(route == router.pathname && route == '/home'){
        return styles.linksActive
      }
      else if(route == router.query.object){
        return styles.linksActive
      }
      else return styles.links
    }

    const overlayMode = () => {
      if(mode)
        return styles.overlayActive;
      else
        return styles.overlay;
    } 

    if(router.pathname === '/[object]/edit'){
      return (<> </>);
    }
    
    return(
      <>
        <nav className={styles.navContainer}>
          <div className={styles.wrapper}>
            <Link href="/">
                <img src="/iconInverted.svg" alt="KnowledgeBox" className={styles.logo} />
            </Link>
            <ul id="nav-laptop" className={styles.list}>
                {user ?
                  <>
                      <li className={isActive('/home')}><Link href="/home" className={styles.linkParent}><a className={isActive('/home')}>Home</a></Link></li>
                      <li className={isActive('quiz')}><Link href="/quiz"><a className={isActive('quiz')}>Quiz</a></Link></li>
                      <li className={isActive('video')}><Link href="/video"><a className={isActive('video')}>Video</a></Link></li>
                      <li className={isActive('test')}><Link href="/test"><a className={isActive('test')}>Test</a></Link></li>  
                  </>   
                  :
                  <>
                  </>
                }
            </ul>
            {user ?
              <>
                <a id="button-laptop">
                  <button className={styles.logout} onClick={()=>{
                      cookie.remove('user')
                      router.push('/')
                    }}
                  >
                    Log Out
                  </button>
                </a>   
                <a className={styles.menuWrapper}>
                  <div onClick={() =>{setMode(true)}}>
                    <div className={styles.burgerButton}></div>
                    <div className={styles.burgerButton}></div>
                    <div className={styles.burgerButton}></div>
                  </div>
                </a> 
              </>
                :
              <>
              </>
            }
          </div>
        </nav>
        <div className={overlayMode()}>
            <a className={styles.close} onClick={() =>{setMode(false)}}>&times;</a>
            <div className={styles.overlayContent}>
              <Link href="/home"><a className={styles.menuLinks} onClick={() =>{setMode(false)}}>Home</a></Link>
              <Link href="/quiz"><a className={styles.menuLinks} onClick={() =>{setMode(false)}}>Quiz</a></Link>
              <Link href="/video"><a className={styles.menuLinks} onClick={() =>{setMode(false)}}>Video</a></Link>
              <Link href="/test"><a className={styles.menuLinks} onClick={() =>{setMode(false)}}>Test</a></Link>
            </div>
        </div>
      </>
    )
}

export default NavBar