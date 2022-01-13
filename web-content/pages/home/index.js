import _ from 'lodash';
import Head from 'next/head';
import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';
import axios from '../../src/services/axios';
import 'react-toastify/dist/ReactToastify.css';
import {useState, useEffect, useRef} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import Feed from './feed';
import Category from './category';
import Profile from './userProfile';
import Payments from './payments';
import Refer from './referEarn';
import Users from './usersList';

import styles from '../../styles/Home.module.css';

export default function Home(props) {
  const router = useRouter();

  const [user, setUser] = useState(JSON.parse(props.user));

  const [centralItem, setCentralItem] = useState('feed');

  const displayToasterMessage = (toastType, message) => {
    if(toastType = 'error'){
      return toast.error(Message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
    } else if (toastType = 'success') {
      return toast.success(Message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
    } else if (toastType = 'warning') {
      return toast.warning(Message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
    } else if (toastType = 'info') {
      return toast.info(Message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
    } else if (toastType = 'dark') {
      return returntoast.dark(Message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
    } else {
      return toast.default(Message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
    }
  }

  const switchCentralModule = () => {
    if(!centralItem){
      return (<Feed user={user} toast={displayToasterMessage}/>);
    } else if(centralItem == 'category'){
      return (<Category user={user} toast={displayToasterMessage}/>);
    } else if(centralItem == 'profile'){
      return (<Profile user={user}  toast={displayToasterMessage}/>);
    } else if(centralItem == 'users'){
      return (<Users user={user} toast={displayToasterMessage}/>);
    } else if(centralItem == 'payment'){
      return (<Payments user={user} toast={displayToasterMessage}/>);
    } else if(centralItem == 'refer'){
      return (<Refer user={user} toast={displayToasterMessage}/>);
    } else {
      return (<Feed user={user} toast={displayToasterMessage}/>);
    }
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div className={styles.leftModule}>
          <p className={centralItem == 'feed'? styles.leftContentBold: styles.leftContent} onClick={() => setCentralItem('feed')}>Home Feed</p>
          <p className={centralItem == 'category'? styles.leftContentBold: styles.leftContent} onClick={() => setCentralItem('category')}>Categories</p>
          <p className={centralItem == 'profile'? styles.leftContentBold: styles.leftContent} onClick={() => setCentralItem('profile')}>My Profile</p>
          <p className={centralItem == 'users'? styles.leftContentBold: styles.leftContent} onClick={() => setCentralItem('users')}>Users</p>
          <p className={centralItem == 'payment'? styles.leftContentBold: styles.leftContent} onClick={() => setCentralItem('payment')}>Payments</p>
          <p className={centralItem == 'refer'? styles.leftContentBold: styles.leftContent} onClick={() => setCentralItem('refer')}>Referral & Coupon Code</p>
        </div>
        <div className={styles.centerModule}>
          {
            switchCentralModule()
          }  
        </div>
        <div className={styles.rightModule}>
          <p className={styles.rightHeading}>Statistics</p>
          <p className={styles.rightContent}>This would be available in later releases.</p>
        </div>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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