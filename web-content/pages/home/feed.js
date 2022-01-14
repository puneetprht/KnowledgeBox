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
import { faLanguage, faCheckDouble, faCheck, faPlus, faTrashAlt, faTimes, faEdit} from '@fortawesome/free-solid-svg-icons';

import {aws} from '../../src/constants/aws';
import styles from '../../styles/Category.module.css';

function Feed(props) {
  const router = useRouter()
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldSubject, setOldSubject] = useState('');
  const [isUpload, setIsUpload] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [newCategory, setNewCategory] = useState({categoryName: '', id: 0});
  const [categoryList, setCategoryList] = useState([]);

  // const [openLightBox, setOpenLightBox] = useState(false);
  // const [lightBoxArray, setLightBoxArray] = useState([]);

  // let inputFileQuestion = useRef(null);

  // const S3config ={
  //   bucketName: aws.Bucket,
  //   dirName: 'Images/' + object,
  //   region: aws.Region,
  //   accessKeyId: aws.Access_Key_ID,
  //   secretAccessKey: aws.Secret_Access_Key
  // }

// const S3Client = new S3(S3config);

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
            setIsSubmit(true);
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

  // const openImagePicker = (event, item, index) => {
  //   event.preventDefault();

  //   setSelectedIndex(questionsList.findIndex(q => q.count == item.count));
  //   switch(index){
  //     case 1:
  //       inputFile1.current.click();
  //       break;
  //     case 2:
  //       inputFile2.current.click();
  //       break;
  //     case 3:
  //       inputFile3.current.click();
  //       break;
  //     case 4:
  //       inputFile4.current.click();
  //       break;
  //     case 5:
  //       inputFile5.current.click();
  //       break;
  //     case 7:
  //       inputFileQuestion.current.click();
  //       break;
  //     case 8:
  //       inputFileExplanation.current.click();
  //       break;
  //   }
  // }

  // const imagePicker = (event, index) => {
  //   event.preventDefault(); 

  //   //setIsUpload(item.id);
  //   //console.log(item);
  //   console.log('Index: ', selectedIndex);
  //   console.log(event.target.files[0]);
  //   let fileName = event.target.files[0].name.split('.')[0];
  //   S3Client.uploadFile(event.target.files[0], fileName)
  //   .then((data) => {
  //     //console.log(data);
  //     let obj = {};
  //     obj.attachmentUrl = data.location;
  //     obj.attachmentName = event.target.files[0].name;
  //     obj.attachmentId = data.key;
  //     obj.questionId = questionsList[selectedIndex].id || 0;
  //     obj.parentId = objectId || 0;
  //     obj.option = index || 0;
  //     obj.deleted = false;
  //     return axios.post('/' + object + '/saveImage', obj);
  //   }).then((result) => {
  //     setIsUpload(0);
  //     let tempItem = questionsList[selectedIndex]
  //     if(index == 7){
  //       setQuestionProperty(result.data.url, tempItem, 'questionAttachmentUrl', result.data.id, 'questionAttachmentId') ;
  //     } else if(index == 8){
  //       setQuestionProperty(result.data.url, tempItem, 'expAttachmentUrl', result.data.id, 'expAttachmentId') ;
  //     } else{
  //       setQuestionProperty(result.data.url, tempItem, 'optionAttachmentUrl' + index, result.data.id, 'optionAttachmentId' + index) ;
  //     }
  //     //console.log(item);
  //     toast.success('Image uploaded successfully!', {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       draggable: true,
  //     });
  //   })
  //   .catch((err) => {
  //     setIsUpload(0);
  //     console.error(err);
  //     toast.error('Error Uploading Image, contact developer.', {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       draggable: true,
  //     });
  //   })
  // }

  // const removeAttachment = (item, index) => {
  //   let obj = {};
  //   obj.id = index == 7 ? item.questionAttachmentId :item['optionAttachmentId' + index] || 0
  //   obj.id = index == 8 ? item.expAttachmentId : obj.id
  //   obj.questionId = item.id || 0;
  //   obj.parentId = objectId || 0;
  //   obj.option = index;
  //   obj.deleted = true;
  //   axios.post('/' + object + '/saveImage', obj)
  //   .then((result) => {
  //     setIsUpload(0);
  //     if(index == 7){
  //       setQuestionProperty(null, item, 'questionAttachmentUrl', 0, 'questionAttachmentId') ;
  //     } else if (index == 8){
  //       setQuestionProperty(null, item, 'expAttachmentUrl', 0, 'expAttachmentId') ;
  //     }
  //     else{
  //       setQuestionProperty(null, item, 'optionAttachmentUrl' + index, 0, 'optionAttachmentId' + index) ;
  //     }
  //     toast.success('Image Removed successfully!', {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       draggable: true,
  //     });
  //   })
  //   .catch((err) => {
  //     setIsUpload(0);
  //     toast.error('Error removing Image, contact developer.', {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       draggable: true,
  //     });
  //   })
  // }

  const changeSubject= (id,value) => {
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
                        onChange={(e)=>changeSubject(item.id, e.target.value)}
                      />
                    </span>
                    <span>
                      <FontAwesomeIcon className={styles.confirm} size="1x" icon={faCheck} onClick={() => postCategory({id:item.id, categoryName: item.name})}/>
                      <FontAwesomeIcon className={styles.confirmCross} size="1x" icon={faTimes} onClick={() => {setEditSubject(0); changeSubject(item.id, oldSubject);}}/>
                    </span>
                  </div>
                  :
                  <div className={styles.leftEditSubject}>
                      <p>
                        {item.name}
                      </p>
                    <FontAwesomeIcon className={styles.confirm} size="1x" icon={faEdit} onClick={() => {setEditSubject(item.id); setOldSubject(item.name);}}/>
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

  export default Feed 