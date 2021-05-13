import cookie from 'js-cookie';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';
import axios from '../src/services/axios';
import {useState, useEffect} from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from '../styles/Index.module.css'

export default function Home() {

  const router  = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const sendCred = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setIsError(false);
    axios
      .post('/user/authenticate', {
        email: email,
        password: password,
      })
      .then(async (response) => {
        cookie.set('user',response.data)
        setEmail('');
        setPassword('');
        setFormValid(false);
        setIsSubmit(false);
        setIsError(false);
        router.push('/home');
      })
      .catch((err) => {
        setIsSubmit(false);
        setIsError(true);
        console.log(err);
      });
  };


  const checkFormValid = (text, type) => {
    switch (type) {
      case 'Email':
        setFormValid(text.length && password.length >= 8);
        break;
      case 'Password':
        setFormValid(email.length && text.length >= 8);
        break;
    }
  };

    return(
      <div className={styles.container}>
        <h3 className={styles.title}>LOGIN</h3>
        <form className={styles.main} onSubmit={(e)=>sendCred(e)}>
           <input className={styles.text} type="email" placeholder="Email"
            autocomplete="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <div className={styles.password}>
              <input className={styles.text} type={isShow ? "text" : "password" } placeholder="Password"
              value={password} autocomplete="password"
              onChange={(e)=>setPassword(e.target.value)}
              />
              <span><FontAwesomeIcon className={styles.eye} size="1x" icon={isShow?faEye:faEyeSlash} onClick={() => setIsShow(!isShow)}/></span>
            </div>
            {isError?<p className={styles.error}>*Username / password is not correct</p>:<></>}
            <button className={styles.button} type="submit">Login
              <i className="material-icons right">forward</i>
            </button>
        </form>
      </div>
    )
}

export async function getServerSideProps(ctx){
  const {user} = parseCookies(ctx)
  if(user){
      const {res} = ctx
      res.writeHead(302,{Location:"/home"})
      res.end()
  }
  return {props: {user: user || {}}};
}

// export const gradientColor1 = '#009CDE';
// export const gradientColor2 = '#003087';
// export const gradientColorTheme1 = '#FF8E1C';
// export const gradientColorTheme2 = '#FF621C';
// export const success = '#1fc281';
// export const error = '#de3500';
// export const textColor1 = '#003e92';
// export const textColor2 = '#008ACF';