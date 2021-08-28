import _ from 'lodash';
import Link from 'next/link';
import {parseCookies} from 'nookies';
import {useRouter} from 'next/router';
import axios from '../../src/services/axios';
import 'react-toastify/dist/ReactToastify.css';
import {useState, useEffect, useRef} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Object.module.css';

export default function Objects(props) {
  const router = useRouter();
  const object = router.query.object;

  const [user, setUser] = useState(JSON.parse(props.user));

  const [category, setCategory] = useState(0);
  const [list, setList] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
   
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldSubject, setOldSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');

  /* API call functions*/
  useEffect(() => {
    fetchAllSubjects();
    fetchCategories();
    setCategory(0);
    setEditMode(false);
    setOldSubject('');
    setNewSubject('');
    setEditSubject(0);
  }, [object]);

  const fetchAllSubjects = () => {
      axios
        .get('/'+ object +'/getAllSubjects', {
          params: {
            selectedCategory: JSON.stringify([]),
            user: user,
            isAdmin: true,
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
          console.error(err);
        });
  };

  const fetchCategories = () => {
    axios
      .get('/common/getCategoryList')
      .then((response) => {
        let array = [];
        if (response.data) {
          array = response.data;
        } 
        array.unshift({number: 0, id: 0, name: "All"})
        setDropdownList(array);
      })
      .catch((err) => {
        console.error("Categories:", err);
      });
  };

  const fetchSubject = (categoryId) => {
    setCategory(categoryId);
    if(categoryId){
    axios
      .get('/'+object+'/getSubject', {
        params: {
          id: categoryId,
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
        console.error("Fetch subject list:", err);
      });
    }else{
      fetchAllSubjects();
    }
  };

  const updateSubject = (id, value) => {
    axios
      .post('/common/updateSubject', {
        id: id,
        value: value
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

  const updateAmount = (id,amount) => {
    axios
    .post('/' + object + '/postAmount', {
      id: id,
      amount: amount || 0,
      table: 'subject',
    })
    .then((response) => {
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const deleteSubject = (id) => {
    if (id) {
      confirmAlert({
        title: 'Delete ' + countString(1),
        message: 'Are you sure you want to delete this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
            axios
             .delete('/' + object + '/deleteSubject', {
               data: {
                 id: id,
               },
             })
             .then((response) => {
               if(category){
                 fetchSubject(category);
               }else{
                 fetchAllSubjects();
               }
               toast.success('Delete successfully subject.', {
                 position: "top-center",
                 autoClose: 3000,
                 hideProgressBar: true,
                 closeOnClick: true,
                 draggable: true,
               });
             })
             .catch((err) => {
               console.error(err);
               toast.error('Error deleting Subject, contact developer.', {
                 position: "top-center",
                 autoClose: 3000,
                 hideProgressBar: true,
                 closeOnClick: true,
                 draggable: true,
               });
             });
           }
          },
          {
            label: 'No',
            onClick: () => console.log("No Pressed")
          }
        ]
      });
    }
    setEditMode(false);
  };

  const postSubject = (value) => {
    if (value) {
      axios
        .post('/' + object + '/addSubject', {
          subjectName: value,
          categoryId: category,
        })
        .then((response) => {
          setNewSubject('');
          setEditMode(false);
          if(category){
            fetchSubject(category);
          }else{
            fetchAllSubjects();
          }
          toast.success('Subject added successfully.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        })
        .catch((err) => {
          console.error("Posting subject:", err);
          toast.error('Error adding Subject, contact developer.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
          });
        });
    }
  };

  /* Normal function definitions*/
  const updateFlags = (id,flag) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    
    if(flag && index >= 0){
      axios
        .post('/video/postIsPaid', {
          id: id,
          flag: !lists[index].isPaid,
          table: 'subject',
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
        .post('/video/postIsActive', {
          id: id,
          flag: !lists[index].isActive,
          table: 'subject',
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


  const updateAmountList = (id,amount) => {
      const lists = JSON.parse(JSON.stringify(list));
      let index = lists.findIndex(l => l.id == id);
      lists[index].amount = parseInt(amount) || 0;
      setList(lists);
  };

  const changeSubject= (id,value) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    lists[index].subjectName = value;
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
      <div className={styles.dropdown}>
        <p>This will show dropdown on small screen.</p>
      </div>
      <main className={styles.container}>
        <div className={styles.leftModule}>
          <p className={styles.leftHeading}>Categories</p>
          {dropdownList.map(item => {return(
              <div key={item.id}>
                <p className={item.id == category ? styles.leftContentActive : styles.leftContent}
                onClick={() => fetchSubject(item.id)}>
                  {item.name}
                </p>
              </div>
            )
            })
          }
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

