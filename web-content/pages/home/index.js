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

import styles from '../../styles/Home.module.css';

export default function Home(props) {
  const router = useRouter();
  const object = router.query.object;

  const [user, setUser] = useState(JSON.parse(props.user));

  const [category, setCategory] = useState(0);
  const [list, setList] = useState([]);
   
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldSubject, setOldSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div className={styles.leftModule}>
          <p className={styles.leftHeading}>Internal Links</p>
        </div>
        <div className={styles.centerModule}>
          {
            list.map(item => {return(
              <div className={styles.centerGrid} key={item.id}>
                <div className={styles.centerGridSubject}>
                  {
                    editSubject == item.id 
                    ? 
                    <div className={styles.centerConfirmSubject}>
                      <span className={styles.textInputSubject}>
                        <input type="text"
                          value={item.subjectName}
                          onChange={(e)=>changeSubject(item.id, e.target.value)}
                        />
                      </span>
                      <span>
                        <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => updateSubject(item.id, item.subjectName)}/>
                        <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {setEditSubject(0); changeSubject(item.id, oldSubject);}}/>
                      </span>
                    </div>
                    :
                    <div className={styles.centerEditSubject}>
                      <Link href={`/${router.query.object}/topic?sId=${item.id}&cId=${item.category}`}>
                        <p>
                          {item.categoryName? item.subjectName.trim() + ' (' + item.categoryName + ')':item.subjectName}
                        </p>
                      </Link> 
                      <FontAwesomeIcon className={styles.confirm} size="1x" icon={faEdit} onClick={() => {setEditSubject(item.id); setOldSubject(item.subjectName);}}/>
                    </div>
                  }
                </div>
                <Link href={`/${router.query.object}/topic?sId=${item.id}&cId=${item.category}`}>
                <p className={styles.centerGridCount}>
                  {item.count} {countString(item.count)}
                </p>
                </Link>
                <div className={styles.centerGridAction}>
                  <div className={styles.ActionRow1}>
                    <label>
                      <input type="checkbox" value={item.isActive} checked={item.isActive?"checked":''} onChange={()=> updateFlags(item.id,false)}/>
                      <span className={styles.isActive}> Is Active </span>
                    </label>
                    <FontAwesomeIcon className={styles.trash} size="1x" icon={faTrashAlt} onClick={() => deleteSubject(item.id)}/>
                  </div>
                  {object == 'video' || object == 'test'? 
                  <div className={styles.ActionRow2}>
                    <label>
                      <input type="checkbox" value={item.isPaid} checked={item.isPaid?"checked":''} onChange={()=> updateFlags(item.id,true)}/>
                      <span className={styles.isActive}> Is Paid </span>
                    </label>
                    <div className={styles.actionTextInput}>
                      <div className="row">
                        <div className="input-field">
                          <input id={"amount" + item.id} type="text"
                            value={item.amount || ''}
                            onChange={e => {updateAmountList(item.id, e.target.value); postAmount(item.id, e.target.value);}}
                          />
                          <label htmlFor={"amount" + item.id} className={item.amount?"active": ""}>Amount</label>
                        </div>
                      </div>
                    </div>
                  </div> :<>
                  </>}
                </div>
              </div>
            )
            })
          }
          {
            editMode && category != 0 ? 
            (
              <div className={styles.boxSimple}>
                <div className={styles.centerConfirmSubject}>
                  <span className={styles.textInputSubject}>
                  <input
                    value={newSubject}
                    placeholder="Enter Subject"
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                  </span>
                  <span>
                    <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postSubject(newSubject)}/>
                    <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => setEditMode(false)}/>
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.addParent}>
              <FontAwesomeIcon className={styles.add} size="1x" icon={faPlus} onClick={() => {
                category != 0 ? setEditMode(true) :
                toast.error('Please select anyone category.', {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  draggable: true,
                });
              }}/>
              </div>
            )
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