import _ from 'lodash';
import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../../src/services/axios';
import {useState, useEffect, useRef} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import styles from '../../../styles/Topic.module.css';

export default function Topic({user}) {
  const router = useRouter()
  const object = router.query.object;
  const subjectId = router.query.sId;
  const categoryId = router.query.cId;

  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldSubject, setOldSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchAllTopics();
  }, []);

  const fetchAllTopics = () => {
    axios
      .get('/' + object +'/getSubTopicList', {
        params: {
          id: subjectId,
          user: user,
        },
      })
      .then((response) => {
        if (response.data) {
          setList(response.data);
        } else {
          setList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postSubtopic = (id, value) => {
    if (value) {
      axios
        .post('/common/addSubTopic', {
          SubTopicName: value,
          subjectId: subjectId,
          catergoryId: categoryId,
          subtopicId: id || 0,
        })
        .then((response) => {
          setNewSubject('');
          fetchAllTopics();
          setEditSubject(0);
          toast.success('Topic added successfully.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error adding Topic, contact developer.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        });
    }
    setEditMode(false);
  };

  const deleteSubject = (id) => {
    if (id) {
      axios
        .delete('/common/deleteSubTopic', {
          data: {
            id: id,
          },
        })
        .then((response) => {
          fetchAllTopics();
          toast.success('Topic deleted successfully.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error deleting topic, contact developer.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        });
    }
  };

  const updateFlags = (id,flag) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    
    if(flag && index >= 0){
      axios
        .post('/' + object + '/postIsPaid', {
          id: id,
          flag: !lists[index].isPaid,
          table: 'subtopic',
        })
        .then((response) => {
          lists[index].isPaid = !lists[index].isPaid;
          setList(lists);
        })
        .catch((err) => {
          console.log(err);
        });
    }else if( index >= 0){
      axios
        .post('/' + object + '/postIsActive', {
          id: id,
          flag: !lists[index].isActive,
          table: 'subtopic',
        })
        .then((response) => {
          lists[index].isActive = !lists[index].isActive;
          setList(lists);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const postAmount = useRef(_.debounce((id,amount) => updateAmount(id,amount), 2000)).current;
   
  const updateAmount = (id,amount) => {
    axios
    .post('/' + object + '/postAmount', {
      id: id,
      amount: amount,
      table: 'subtopic',
    })
    .then((response) => {
    })
    .catch((err) => {
      console.log(err);
    });
  }
   
  /* Normal function definitions*/
  const updateAmountList = (id,amount) => {
      const lists = JSON.parse(JSON.stringify(list));
      let index = lists.findIndex(l => l.id == id);
      lists[index].amount = parseInt(amount) || 0;
      setList(lists);
  };

  const changeSubject= (id,value) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    lists[index].value = value;
    setList(lists);
  };

  const countString = (val) => {
    if(object == 'quiz'){
      return val < 2 ? 'Quiz' : 'Quizes';
    } else if(object == 'test') {
      return val < 2 ? 'Test' : 'Tests';
    } else if(object == 'video') {
      return val < 2 ? 'Video' : 'Videos';
    }
    return '';
  };
  
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.heading}>
        {countString(1)} topics
      </h4>
      <main className={styles.container}>
        <div className={styles.leftModule}>
          {
            list.map(item => {return(
              <div className={styles.leftGrid} key={item.id}>
                <div className={styles.leftGridSubject}>
                  {
                    editSubject == item.id 
                    ? 
                    <div className={styles.leftConfirmSubject}>
                      <span className={styles.textInputSubject}>
                        <input type="text"
                          value={item.value}
                          onChange={(e)=>changeSubject(item.id, e.target.value)}
                        />
                      </span>
                      <span>
                        <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postSubtopic(item.id, item.value)}/>
                        <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {setEditSubject(0); changeSubject(item.id, oldSubject);}}/>
                      </span>
                    </div>
                    :
                    <div className={styles.leftEditSubject}>
                      <Link href={`/${router.query.object}/topic/list?sId=${subjectId}&cId=${categoryId}&id=${item.id}`}>
                        <p>
                          {item.value}
                        </p>
                      </Link> 
                      <FontAwesomeIcon className={styles.confirm} size="1x" icon={faEdit} onClick={() => {setEditSubject(item.id); setOldSubject(item.value);}}/>
                    </div>
                  }
                </div>
                <Link href={`/${router.query.object}/topic/list?sId=${subjectId}&cId=${categoryId}&id=${item.id}`}>
                  <p className={styles.leftGridCount}>
                    {item.count} {countString(item.count)}
                  </p>
                </Link>
                <div className={styles.leftGridAction}>
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
                    <span className={styles.actionTextInput}>
                      <input type="text"
                        value={item.amount}
                        onChange={e => {updateAmountList(item.id, e.target.value); postAmount(item.id, e.target.value);}}
                      />
                    </span>
                  </div> :<>
                  </>}
                </div>
              </div>
            )
            })
          }
          {
            editMode ? 
            (
              <div className={styles.boxSimple}>
                <div className={styles.leftConfirmSubject}>
                  <span className={styles.textInputSubject}>
                  <input
                    value={newSubject}
                    placeholder="Enter Subject"
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                  </span>
                  <span>
                    <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postSubtopic(0, newSubject)}/>
                    <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => setEditMode(false)}/>
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.addParent}>
                <FontAwesomeIcon className={styles.add} size="1x" icon={faPlus} onClick={() => setEditMode(true)}/>
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
