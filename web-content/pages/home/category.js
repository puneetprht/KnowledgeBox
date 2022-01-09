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
import { faLanguage, faCheckDouble, faArrowLeft, faPlus, faTrashAlt, faTimes, faImages} from '@fortawesome/free-solid-svg-icons';

import {aws} from '../../src/constants/aws';
import styles from '../../styles/Edit.module.css';

function Category(props) {
  const router = useRouter()
  const [saved, setSaved] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
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
        .get('/' + object + '/get' + object + 'Detail', {
          params: {
            id: objectId,
          },
        })
        .then((response) => {         
          if (response.data) {
            response.data.forEach(element => {
              element.correctOption = element.correctOption.split(',').map(Number);
            });
            setQuestionsList(response.data);
          }
          setSaved(true);
        })
        .catch((err) => {
          console.error(err);
        });
  }

  const postCategories = (event) => {
    event.preventDefault();
    if(validateQuiz()){
      toast.error('Please correct errors in ' + countString(1) + '.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }
    setIsSubmit(true);
    if(object == 'test'){
      axios
      .post('/test/postTest', {
        subTopicId: subTopicId,
        subjectId: subjectId,
        categoryId: categoryId,
        questions: questionsList,
        testName: objectTitle,
        testId: objectId,
        testTime: parseFloat(timeDuration),
        testInstructions: instructions,
      })
      .then((response) => {
        setIsSubmit(false);
        setSaved(true);
        if(objectId == 0 && response.data.id){
          router.replace(`/${object}/edit?sId=${subjectId}&cId=${categoryId}&stId=${subTopicId}&id=${response.data.id}`)
        }
        getObject();
        toast.success('Test saved successfully.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
      })
      .catch((err) => {
        setIsSubmit(false);
        console.error(err);
      });
    } else if(object =='quiz'){
      axios
      .post('/quiz/postQuiz', {
        subTopicId: subTopicId,
        subjectId: subjectId,
        categoryId: categoryId,
        quizId: objectId,
        questions: questionsList,
        quizName: objectTitle,
        quizTime: parseFloat(timeDuration),
      })
      .then((response) => {
        setIsSubmit(false);
        setSaved(true);
        if(objectId == 0 && response.data.id){
          router.replace(`/${object}/edit?sId=${subjectId}&cId=${categoryId}&stId=${subTopicId}&id=${response.data.id}`)
        }
        getObject();
        toast.success('Quiz saved successfully.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
      })
      .catch((err) => {
        setIsSubmit(false);
        console.error(err);
      });
    }
  };

  const deleteObject = (event) => {
    event.preventDefault();
    if (objectId) {
      confirmAlert({
        title: 'Delete ' + countString(1),
        message: 'Are you sure you want to delete this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              setIsSubmit(true);
              axios
                .delete('/' + object + '/delete' + object, {
                  data: {
                    id: objectId,
                  },
                })
                .then((response) => {
                  toast.success(countString(1) + ' deleted successfully.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    draggable: true,
                  });
                  router.back();
                })
                .catch((err) => {
                  console.error(err);
                  toast.error('Error deleting '+countString(1)+', contact developer.', {
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
    } else{
      toast.error('New '+countString(1)+' cannot delete.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

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

  return (
     <div className={styles.container}>
      {/*<div className={styles.objectContainer}>
        <div className={styles.objectHeader}>
          <div className={styles.objectTitle}>
            <div className="input-field">
              <input id="title" type="text" required={true} aria-required={true}
                value={objectTitle}
                onChange={(e)=>setObjectTitle(e.target.value)}
              />
              <label htmlFor="title" className={objectTitle?"active": ""}>{countString(1)} Title</label>
            </div>
          </div>
          <div className={styles.timeDuration}>
            <div className="input-field">
              <input type="number" required={true} aria-required={true}
                id="number" 
                value={timeDuration}
                onChange={(e)=>setTimeDuration(e.target.value)}
              />
              <label htmlFor="number" className={timeDuration?"active": ""}>Time Duration</label>
            </div>
          </div>
        </div>
        <div>
          {object == 'test'?
            <div className="row">
              <div className="input-field">
                <textarea id="instructions" type="text" className="materialize-textarea"
                  value={instructions}
                  onChange={(e)=>setInstructions(e.target.value)}
                />
                <label htmlFor="instructions" className={instructions?"active": ""}>Test Instructions</label>
              </div>
            </div>
            :<></>
          }
        </div>
        <div className={styles.questionList}>
          {questionsList.length ?
            (questionsList.map((item, itemIndex) => {
              return (
                <div key={itemIndex} className={isQuestionValid(item)? styles.question : styles.questionWrong}>
                  <div className={styles.optionBox}>
                    {
                      item.questionAttachmentUrl ?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,7)}/>
                          <img src={item.questionAttachmentUrl} height="100" 
                          onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.questionAttachmentUrl]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                    }
                    <div className="input-field">
                      <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                        value={ item.languageFlag? item.questionLang: item.question }
                        onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag?"questionLang":"question")}
                      />
                      <label htmlFor={"question"+item.count} className={(item.languageFlag? item.questionLang: item.question) ?"active": ""}> {item.languageFlag? "प्रश्न": "Question"} {item.count}</label>
                    </div>
                    {
                      !item.questionAttachmentUrl ?
                        <div>
                          <FontAwesomeIcon className={(item.languageFlag? item.questionLang: item.question)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 7)} size="1x" icon={faImages}/>
                        </div>
                      : <></>
                    }
                  </div>
                  <div className={styles.optionSelection}>
                    <span className={item.correctOption.includes(1)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,1)}}>1</span>
                    <span className={item.correctOption.includes(2)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,2)}}>2</span>
                    <span className={item.correctOption.includes(3)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,3)}}>3</span>
                    <span className={item.correctOption.includes(4)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,4)}}>4</span>
                    <span className={item.correctOption.includes(5)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,5)}}>5</span>
                    <input className={styles.uploadImage} ref={inputFile1} onChange={(e) => imagePicker(e,1)} type='file' accept="image/*"/>
                    <input className={styles.uploadImage} ref={inputFile2} onChange={(e) => imagePicker(e,2)} type='file' accept="image/*"/>
                    <input className={styles.uploadImage} ref={inputFile3} onChange={(e) => imagePicker(e,3)} type='file' accept="image/*"/>
                    <input className={styles.uploadImage} ref={inputFile4} onChange={(e) => imagePicker(e,4)} type='file' accept="image/*"/>
                    <input className={styles.uploadImage} ref={inputFile5} onChange={(e) => imagePicker(e,5)} type='file' accept="image/*"/>
                    <input className={styles.uploadImage} ref={inputFileQuestion} onChange={(e) => imagePicker(e,7)} type='file' accept="image/*"/>
                    <input className={styles.uploadImage} ref={inputFileExplanation} onChange={(e) => imagePicker(e,8)} type='file' accept="image/*"/>
                  </div>
                  <div className={styles.optionContainer}>
                    <div className={styles.optionBox}>
                      {
                        item.optionAttachmentUrl1 ?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,1)}/>
                          <img src={item.optionAttachmentUrl1} height="100"
                            onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.optionAttachmentUrl1]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                      }
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang1: item.option1}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang1": "option1")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang1: item.option1)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 1</label>
                      </div>
                      {
                        !item.optionAttachmentUrl1 ?
                        <div>
                          <FontAwesomeIcon className={(item.languageFlag? item.optionLang1: item.option1)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 1)} size="1x" icon={faImages}/>
                        </div>
                        :<></>
                      }
                    </div>
                    <div className={styles.optionBox}>
                      {
                        item.optionAttachmentUrl2 ?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,2)}/>
                          <img src={item.optionAttachmentUrl2} height="100"
                          onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.optionAttachmentUrl2]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                      }
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" width="90%" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang2: item.option2}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang2": "option2")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang2: item.option2)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 2</label>
                      </div>
                      {
                        !item.optionAttachmentUrl2 ?
                        <div>                          
                          <FontAwesomeIcon className={(item.languageFlag? item.optionLang2: item.option2)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 2)} size="1x" icon={faImages}/>
                        </div>
                        :<></>
                      }
                    </div>
                    <div className={styles.optionBox}>
                      {
                        item.optionAttachmentUrl3 ?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,3)}/>
                          <img src={item.optionAttachmentUrl3} height="100" 
                          onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.optionAttachmentUrl3]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                      }
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang3: item.option3}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang3": "option3")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang3: item.option3)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 3</label>
                      </div>
                      {
                        !item.optionAttachmentUrl3 ?
                      <div>
                        
                        <FontAwesomeIcon className={(item.languageFlag? item.optionLang3: item.option3)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 3)} size="1x" icon={faImages}/>
                      </div>
                      : <></>
                      }
                    </div>
                    <div className={styles.optionBox}>
                      {
                        item.optionAttachmentUrl4 ?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,4)}/>
                          <img src={item.optionAttachmentUrl4} height="100"
                          onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.optionAttachmentUrl4]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                      }
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang4: item.option4}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang4": "option4")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang4: item.option4)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 4</label>
                      </div>
                      {!item.optionAttachmentUrl4?
                        <div>
                          
                          <FontAwesomeIcon className={(item.languageFlag? item.optionLang4: item.option4)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 4)} size="1x" icon={faImages}/>
                        </div>:
                        <></>
                      }
                    </div>
                    <div className={styles.optionBox}>
                      {
                        item.optionAttachmentUrl5?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,5)}/>
                          <img src={item.optionAttachmentUrl5} height="100"
                          onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.optionAttachmentUrl5]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                      }
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang5: item.option5}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang5": "option5")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang5: item.option5)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 5</label>
                      </div>
                      {!item.optionAttachmentUrl5?
                        <div>
                          <FontAwesomeIcon className={(item.languageFlag? item.optionLang5: item.option5)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 5)} size="1x" icon={faImages}/>
                        </div>:
                        <></>
                      }
                    </div>
                  </div>
                  <div className={styles.videoParent}>
                    <div className="input-field">
                      <input type="text"
                        id={"videoUrl"+item.count}
                        value={item.videoUrl}
                        onChange={(e)=>saveVideoUrl(e.target.value, item)}
                      />
                      <label htmlFor={"videoUrl"+item.count} className={item.videoUrl?"active": ""}>Solution Video URL</label>
                    </div>
                    {item.videoUrl && !item.videoUrlId?<FontAwesomeIcon className={styles.videoChild1} size="1x" icon={faTimes}/>:<></>}
                    {item.videoUrlId?<FontAwesomeIcon className={styles.videoChild2} size="1x" icon={faCheckDouble}/>:<></>}
                  </div>
                  <div className={styles.optionBox}>
                    {
                        item.expAttachmentUrl?
                        <div className={styles.imageOption}>
                          <FontAwesomeIcon className={styles.imageOptionIcon} size="1x" icon={faTrashAlt} onClick={(e) => removeAttachment(item,8)}/>
                          <img src={item.expAttachmentUrl} height="100"
                          onClick={ (e) => {e.preventDefault(); setLightBoxArray([item.expAttachmentUrl]); setOpenLightBox(!openLightBox) }}></img>
                        </div> 
                      : <></>
                    }
                    <div className="input-field">
                      <textarea id={"explaination"+item.count} type="text" className="materialize-textarea"
                        value={item.languageFlag? item.explainationLang: item.explaination}
                        onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "explainationLang": "explaination")}
                      />
                      <label htmlFor={"explaination"+item.count} className={(item.languageFlag? item.explainationLang: item.explaination)?"active": ""}>{item.languageFlag? "विवरण": "Explanation"}</label>
                    </div>
                    {!item.expAttachmentUrl?
                        <div>
                          <FontAwesomeIcon className={(item.languageFlag? item.explainationLang: item.explaination)?styles.optionImage: styles.optionImage2} onClick={(e) => openImagePicker(e, item, 8)} size="1x" icon={faImages}/>
                        </div>:
                        <></>
                      }
                  </div>
                  <div className={styles.footerContainer}>
                    {object == 'test'? 
                    <div className={styles.weightage}>
                      <div className={styles.weightageChild}>
                        <div className="input-field">
                          <input type="number"
                            id="number" 
                            value={item.weightage}
                            onChange={(e)=>setQuestionProperty(e.target.value, item, "weightage")}
                          />
                          <label htmlFor="number" className={item.weightage?"active": ""}>Positive</label>
                        </div>
                      </div>
                      <div className={styles.weightageChild}>
                        <div className="input-field">
                          <input type="number"
                            id="number" 
                            value={item.negativeWeightage}
                            onChange={(e)=>setQuestionProperty(e.target.value, item, "negativeWeightage")}
                          />
                          <label htmlFor="number" className={item.negativeWeightage >= 0?"active": ""}>Negative</label>
                        </div>
                      </div>
                    </div>
                    :
                    <> </>}
                    <div className={styles.action}>
                      <FontAwesomeIcon className={styles.questionIcon} size="1x" icon={faLanguage} onClick={() => setQuestionProperty(!item.languageFlag, item, "languageFlag")}/>
                      <FontAwesomeIcon className={isQuestionValid(item)?styles.questionIcon2: styles.questionIcon2Wrong} size="1x" icon={faTrashAlt} onClick={() => deleteQuestion(item)}/>
                    </div>
                  </div>
                </div>
              );  
            }))
            :
            <p className={styles.noQuestion}>
              No Questions, please add one.
            </p>
          }
        </div>
        <div className={styles.pageFooter}>
                <FontAwesomeIcon  size="1x" icon={faPlus} 
                onClick={(e) => addQuestion(e)}/>
        </div>
      </div>
      <button className={styles.uploadImage} onClick={ (e) => {e.preventDefault(); setOpenLightBox(!openLightBox) }}>
                Toggle Lightbox 
            </button>
      <FsLightbox toggler={openLightBox}
      sources={lightBoxArray}/>
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
      />*/}
      Category
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