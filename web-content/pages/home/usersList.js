import { useRouter } from 'next/router';
import S3 from 'aws-s3';
import Link from 'next/link';
import {parseCookies} from 'nookies';
import axios from '../../src/services/axios';
import 'react-toastify/dist/ReactToastify.css';
import {useState, useEffect, useRef} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckDouble, faCheck, faSearch, faTrashAlt, faTimes, faEdit} from '@fortawesome/free-solid-svg-icons';

// import {aws} from '../../src/constants/aws';
import styles from '../../styles/Users.module.css';
import { set } from 'lodash';

function Users(props) {
  const router = useRouter();
  const [limit, setLimit] = useState(10); 
  const [offset, setOffset] = useState(0);
  const [loadOffset, setLoadOffset] = useState(false);
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);

  //API Calls
  useEffect(() => {
    getUsers();
    props.setUserId(props.user.id);
  }, [props.user, loadOffset]);

  const getUsers = () => {
    let searchString =  search?'?search='+search:'';
    axios
    .get('/user/getUserList/' + limit + '/' + offset + searchString )
    .then((response) => {         
      if (response.data && offset == 0) {
        setUserList([{id: 0, firstname: 'Full', lastname: 'Name', email: 'Email Id'},...response.data]);
      } else {
        setUserList([...userList, ...response.data]);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  const loadMore = () => {
    setOffset(userList.length - 1);
    setLoadOffset(!loadOffset);
  }

  const redirectUser = (id) => {
    props.setUserId(id);
    props.redirect('profile');
  }

  const searchUser = _.debounce(() => {
    setOffset(0);
    setTimeout(() => getUsers(), 200);
  }, 2000)

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div className="input-field">
          <input id="search" type="text" required={true} aria-required={true}
            value={search}
            onChange={(e)=> {setSearch(e.target.value); setOffset(0); searchUser();}}
          />
          <label htmlFor="search" className={ search ? "active" : "" }> Search</label>
        </div>
        <div className={styles.leftModule}>
        {
          userList.map(item => {return(
            <div className={styles.leftGrid} key={item.id}>
              <div className={styles.leftGridSubject}>
                <span>{item.firstname + " " + item.lastname}</span>
              </div>
              <div className={styles.leftGridSubject}>
                <span>{item.email}</span>
              </div>
              <div className={styles.leftGridAction}>
                <div className={styles.ActionRow1}>
                {item.id ? 
                  <FontAwesomeIcon className={styles.trash} size="1x" icon={faEdit} onClick={() => redirectUser(item.id)}/>
                : <span className={styles.noMargin}>Action</span>
                }
                </div> 
              </div>
            </div>
          )
          })
        }
        <div className={styles.addParent}>
          <FontAwesomeIcon className={styles.add} size="1x" icon={faSpinner} onClick={() => loadMore()}/>
        </div>
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

  export default Users 