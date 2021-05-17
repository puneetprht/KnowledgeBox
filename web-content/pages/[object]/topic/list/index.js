import _ from 'lodash';
import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import {useState, useEffect, useRef} from 'react';
import axios from '../../../../src/services/axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import styles from '../../../../styles/List.module.css';

export default function List({user}) {
  const router = useRouter()
  const object = router.query.object;
  const subjectId = router.query.sId;
  const categoryId = router.query.cId;
  const subTopicId = router.query.id;

  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldSubject, setOldSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const [videoUrl, setVideoUrl] = useState('');
  const [videoName, setVideoName] = useState('');
  
  useEffect(() => {
    fetchAllTopics();
  }, []);

  const fetchAllTopics = () => {
    axios
      .get('/' + object + '/get' + object + 'List', {
        params: {
          id: subTopicId,
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

  const deleteSubject = (id) => {
    if (id) {
      axios
        .delete('/' + object + '/delete' + object, {
          data: {
            id: id,
          },
        })
        .then((response) => {
          fetchAllTopics();
          toast.success('Item deleted successfully.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error deleting item, contact developer.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        });
    }
  };

  const postObject = () => {
    if (!videoName) {
      Alert.alert('Please add a Video Name!');
      return;
    } else if (!videoUrl) {
      Alert.alert('Please add a Video URL!');
      return;
    }
    setEditMode(true);
    axios
      .post('/' + object + '/post' + object, {
        subTopicId: subTopicId,
        subjectId: subjectId,
        categoryId: catergoryId,
        videoName: videoName,
        videoUrl: videoUrl,
      })
      .then((response) => {
        setEditMode(false);
        fetchAllTopics();
      })
      .catch((err) => {
        setEditMode(false);
        Alert.alert('No Video Id detected.');
      });
  };

  const updateSubject = (id, value) => {
    axios
      .post('/common/updateObject', {
        id: id,
        value: value,
        table: object,
      })
      .then((response) => {
        toast.success('Updated subject name!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
          setEditSubject(0);
          console.log("Updated!");
      })
      .catch((err) => {
        toast.error('Error updating subject name, contact developer.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
        console.error("Categories:", err);
      });
  };

  const updateFlags = (id,flag) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    
    if(flag && index >= 0){
      axios
        .post('/' + object + '/postIsPaid', {
          id: id,
          isPaid: !lists[index].isPaid,
          flag: !lists[index].isPaid,
          table: object,
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
          isActive: !lists[index].isActive,
          flag: !lists[index].isActive,
          table: object,
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
      table: object,
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
  }

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

  const getQueryParams = (params, url) => {
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  const getVideoUrlId = (val) => {
    let videoUrlId = getQueryParams('v', val);
    if (!videoUrlId) {
      videoUrlId = val.split('.be/')[1];
    }
    return videoUrlId;
  };

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.heading}>
        {countString(1)} List
      </h4>
      {router.query.object == 'test' || router.query.object == 'quiz'? <Link href={`/${router.query.object}/edit`}><a>Edit</a></Link>:<></>} 
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
                        <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => updateSubject(item.id, item.value)}/>
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
