import { parseCookies } from 'nookies';
import axios from '../../src/services/axios';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTrashAlt, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Category.module.css';

function Category(props) {
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldCategory, setOldCategory] = useState('');
  const [newCategory, setNewCategory] = useState({categoryName: '', id: 0});
  const [categoryList, setCategoryList] = useState([]);

  //API Calls
  useEffect(() => {
    getCategories();
  }, [props.user]);

  const getCategories = () => {
    axios
        .get('/common/getCategoryList')
        .then((response) => {         
          if (response.data) {
            setCategoryList(response.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
  }

  const postCategory = (category) => {
    if(category.categoryName){
      axios
      .post('/common/postCategory', category)
      .then((response) => {
        setEditMode(false);
        setNewCategory({categoryName: '', id: 0});
        if(!category.id){
          getCategories();
        }
        setEditSubject(0);
        toast.success('Category saved successfully.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
      })
      .catch((err) => {
        toast.error('Error posting category, contact developer.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
        console.error(err);
      });
    } else{
      toast.error('Category name cannot be empty.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
    }
  };
  
  const deleteObject = (categoryId) => {
    confirmAlert({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            axios
              .delete('/common/deleteCategory', {
                data: {
                  id: categoryId,
                },
              })
              .then((response) => {
                getCategories();
                toast.success('Category deleted successfully.', {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  draggable: true,
                });
              })
              .catch((err) => {
                console.error(err);
                toast.error('Error deleting Category, contact developer.', {
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
  };

  const addCategory = (value) => {
    setEditMode(true);
    setNewCategory({categoryName: value, id: 0})
  }

  const updateCategory= (id,value) => {
    const lists = JSON.parse(JSON.stringify(categoryList));
    let index = lists.findIndex(l => l.id == id);
    lists[index].name = value;
    setCategoryList(lists);
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div className={styles.leftModule}>
        {
          categoryList.map(item => {return(
            <div className={styles.leftGrid} key={item.id}>
              <div className={styles.leftGridSubject}>
                {
                  editSubject == item.id 
                  ? 
                  <div className={styles.leftConfirmSubject}>
                    <span className={styles.textInputSubject}>
                      <input type="text"
                        value={item.name}
                        onChange={(e)=>updateCategory(item.id, e.target.value)}
                      />
                    </span>
                    <span>
                      <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postCategory({id:item.id, categoryName: item.name})}/>
                      <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {setEditSubject(0); updateCategory(item.id, oldCategory);}}/>
                    </span>
                  </div>
                  :
                  <div className={styles.leftEditSubject}>
                      <p>
                        {item.name}
                      </p>
                    <FontAwesomeIcon className={styles.confirm} size="1x" icon={faEdit} onClick={() => {setEditSubject(item.id); setOldCategory(item.name);}}/>
                  </div>
                }
              </div>
              <div className={styles.leftGridAction}>
                <div className={styles.ActionRow1}>
                  <FontAwesomeIcon className={styles.trash} size="1x" icon={faTrashAlt} onClick={() => deleteObject(item.id)}/>
                </div>
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
                  value={newCategory.categoryName}
                  placeholder="Enter Category"
                  onChange={(e) => addCategory(e.target.value)}
                />
                </span>
                <span>
                  <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postCategory(newCategory)}/>
                  <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {addCategory(''); setEditMode(false);}}/>
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

  export default Category 