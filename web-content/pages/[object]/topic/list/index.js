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
  const subjectId = parseInt(router.query.sId);
  const categoryId = parseInt(router.query.cId);
  const subTopicId = parseInt(router.query.id);

  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldSubject, setOldSubject] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState(0);
  const [oldVideoUrl, setOldVideoUrl] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

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

  const deleteListObject = (id) => {
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

  const updateListObject = (id, value) => {
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
  };

  const postVideoUrl = (id, url, name) => {
    let error = '';
    if(!id && !name){
      error='Please enter Video name.';
    }
    else if(!url){
      error='Please enter Video URL.';
    }
    else if(!getVideoUrlId(url)){
      error='Please enter valid Video URL.';
    }
    if(error){
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }
    axios
      .post('/video/postVideo', {
        id: id,
        subTopicId: subTopicId,
        subjectId: subjectId,
        categoryId: categoryId,
        videoName: name,
        videoUrl: url,
      })
      .then((response) => {
        toast.success('Video Posted!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
        setEditVideoUrl(0);
        fetchAllTopics();
      })
      .catch((err) => {
        toast.error('Error posting Video, contact developer.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
      });
  };

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

  const changeVideoUrl= (id,value) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    lists[index].url = value;
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
    console.log(val);
    let videoUrlId = getQueryParams('v', val);
    console.log(videoUrlId);
    if (!videoUrlId) {
      videoUrlId = val.split('.be/')[1];
    }
    console.log(videoUrlId);
    return videoUrlId;
  };

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.heading}>
        {countString(1)} List
      </h4>
      {/* {router.query.object == 'test' || router.query.object == 'quiz'? <Link href={`/${router.query.object}/edit`}><a>Edit</a></Link>:<></>}  */}
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
                        <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => updateListObject(item.id, item.value)}/>
                        <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {setEditSubject(0); changeSubject(item.id, oldSubject);}}/>
                      </span>
                    </div>
                    :
                    <div className={styles.leftEditSubject}>
                      <p>
                        {item.value}
                      </p>
                      <FontAwesomeIcon className={styles.confirm} size="1x" icon={faEdit} onClick={() => {setEditSubject(item.id); setOldSubject(item.value);}}/>
                    </div>
                  }
                </div >
                { object == 'video' ? (
                    editVideoUrl == item.id 
                    ? 
                    <div className={styles.textVideoUrl}>
                      <div>
                        <input type="text"
                        value={item.url}
                        onChange={(e)=>changeVideoUrl(item.id, e.target.value)}
                        />
                      </div>
                      <div className={styles.videoAction}>
                        <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postVideoUrl(item.id, item.url)}/>
                        <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {setEditVideoUrl(0); changeVideoUrl(item.id, oldVideoUrl);}}/>
                      </div>
                    </div>
                    :
                    <div className={styles.leftEditSubject}>
                      <p>
                        {item.url}
                      </p>
                      <FontAwesomeIcon className={styles.confirm} size="1x" icon={faEdit} onClick={() => {setEditVideoUrl(item.id); setOldVideoUrl(item.url);}}/>
                    </div>
                  ) : 
                  (
                    <div className={styles.centerGrid}>
                      <button className={styles.editButton} onClick={()=> {router.push(`/${object}/edit?sId=${subjectId}&cId=${categoryId}&stId=${subTopicId}&id=${item.id}`)}}>
                        Edit {countString(1)}
                      </button>
                    </div>
                  )
                }
                <div className={styles.rightGridAction}>
                  <div className={styles.ActionRow1}>
                    <label>
                      <input type="checkbox" value={item.isActive} checked={item.isActive?"checked":''} onChange={()=> updateFlags(item.id,false)}/>
                      <span className={styles.isActive}> Is Active </span>
                    </label>
                    <FontAwesomeIcon className={styles.trash} size="1x" icon={faTrashAlt} onClick={() => deleteListObject(item.id)}/>
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
              <div className={styles.postNewVideo}>
                <div className={styles.textInputVideoUrl}>
                  <input
                    value={newVideoUrl}
                    placeholder="Enter Video URL"
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                  />
                </div>
                <div className={styles.postNewVideoRow2}>
                  <span className={styles.postVideoName}>
                    <input
                      value={newVideo}
                      placeholder="Enter Video Name"
                      onChange={(e) => setNewVideo(e.target.value)}
                    />
                  </span>
                  <span className={styles.videoAction}>
                    <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => {
                      postVideoUrl(0, newVideoUrl, newVideo);
                      setEditMode(false);
                      setNewVideo('');
                      setNewVideoUrl('');
                    }}/>
                    <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {
                        setEditMode(false);
                        setNewVideo('');
                        setNewVideoUrl('');
                      }}/>
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.addParent}>
                <FontAwesomeIcon className={styles.add} size="1x" icon={faPlus} 
                onClick={() => object == 'video' ? setEditMode(true) : router.push(`/${object}/edit?sId=${subjectId}&cId=${categoryId}&stId=${subTopicId}&id=0`)}/>
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
