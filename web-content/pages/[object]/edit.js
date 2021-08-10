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
import { faLanguage, faCheckDouble, faArrowLeft, faPlus, faTrashAlt, faTimes} from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Edit.module.css';

export default function ObjectEdit({user}) {
  const router = useRouter()
  const object = router.query.object;
  const subjectId = parseInt(router.query.sId);
  const categoryId = parseInt(router.query.cId);
  const subTopicId = parseInt(router.query.stId);
  const objectId = parseInt(router.query.id);

  const [saved, setSaved] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [objectTitle, setObjectTitle] = useState('');
  const [timeDuration, setTimeDuration] = useState('');
  const questionObject = {
    id: 0,
    count: 1,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    option5: '',
    questionLang: '',
    optionLang1: '',
    optionLang2: '',
    optionLang3: '',
    optionLang4: '',
    optionLang5: '',
    explaination: '',
    explainationLang: '',
    videoUrl: '',
    videoUrlId: '',
    weightage: 1,
    negativeWeightage: 0,
    correctOption: [],
    isMultiple: false,
    languageFlag: false,
  };
  const [questionsList, setQuestionsList] = useState([questionObject]);
  const [instructions, setInstructions] = useState('');

  //API Calls
  useEffect(() => {
    getObject();
  }, [objectId]);

  const getObject = () => {
    if (objectId) {
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
        axios
        .get('/' + object + '/get' + object, {
          params: {
            id: objectId,
          },
        })
        .then((response) => {
          //console.log(response.data);
          setInstructions(response.data.instructions);
          setObjectTitle(response.data.value);
          setTimeDuration(response.data.time);
        })
        .catch((err) => {
          console.error(err);
        });
    } 
  }

  const submitObject = (event) => {
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

  // Normal Functions
  const setQuestionProperty = (val, item, prop) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    let index = questions.findIndex(q => q.count == item.count);
    questions[index][prop] = val;
    setQuestionsList(questions);
    setSaved(false);
  };

  const getQueryParams = (params, url) => {
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  const saveVideoUrl = (val, item) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    let index = questions.findIndex(q => q.count == item.count);
    questions[index].videoUrl = val;
    questions[index].videoUrlId = getQueryParams('v', val);
    if (!questions[index].videoUrlId) {
      questions[index].videoUrlId = val.split('.be/')[1];
    }
    setQuestionsList(questions);
    setSaved(false);
  };

  const isQuestionValid = (item) => {
    let key = questionsList.findIndex(q => q.count == item.count);
    //console.log("key: ", key, " questionObject: ", JSON.stringify(questionsList[key]));
    return (
      questionsList[key].question &&
      questionsList[key].option1 &&
      questionsList[key].option2 &&
      questionsList[key].option3 &&
      questionsList[key].option4 &&
      questionsList[key].correctOption.length
    );
  };

  const validateQuiz = () => {
    return !!questionsList.filter(q => isQuestionValid(q) == false).length || !objectTitle || !timeDuration
  }

  const onOptionPress = (item, option) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    let index = questions.findIndex(q => q.count == item.count);
    if (questions[index].correctOption.includes(option)) {
      questions[index].correctOption.splice(questions[index].correctOption.findIndex(q => q == option),1);
    } 
    else {
        questions[index].correctOption.push(option);
        questions[index].correctOption.sort();
    }
    questions[index].isMultiple = (questions[index].correctOption.length > 1);
    setQuestionsList(questions);
    setSaved(false);
  };

  const deleteQuestion = (item) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    let index = questions.findIndex(q => q.count == item.count);
    questions.splice(index, 1);
    setQuestionsList(questions);
    setSaved(false);
  };

  const navigateBack = () => {
    //To save and navigate back.
    if(saved){
      router.back();
    }
    else{
    confirmAlert({
      title: 'Go back',
      message: 'All the unsaved changes will be erased. Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => router.back()
        },
        {
          label: 'No',
          onClick: () => console.log("No Pressed")
        }
      ]
    });
  }
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

  const addQuestion = () => {
    let question = JSON.parse(JSON.stringify(questionObject))
    question.count = parseInt(questionsList[questionsList.length-1].count)+1;
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions.push(question);
    setQuestionsList(questions);
    setSaved(false);
  }

  return (
    <form className={styles.container}>
      <div className={styles.pageHeader}> 
        <FontAwesomeIcon className={styles.back} size="1x" icon={faArrowLeft} onClick={() => navigateBack()}/>
        <div>
          <button className={styles.buttonDelete} onClick={(e)=>deleteObject(e)}>
            Delete
          </button>
          <button className={styles.button} onClick={(e)=>submitObject(e)}>
            Save
          </button>
          <button className={styles.button} onClick={(e)=>{
              e.preventDefault();
              submitObject(e);
              router.back();
            }}>
            Save & Close 
          </button>
        </div>
      </div>
      <div className={styles.objectContainer}>
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
                  <div>
                    <div className="input-field">
                      <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                        value={ item.languageFlag? item.questionLang: item.question }
                        onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag?"questionLang":"question")}
                      />
                      <label htmlFor={"question"+item.count} className={(item.languageFlag? item.questionLang: item.question) ?"active": ""}> {item.languageFlag? "प्रश्न": "Question"} {item.count}</label>
                    </div>
                  </div>
                  <div className={styles.optionSelection}>
                    <span className={item.correctOption.includes(1)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,1)}}>1</span>
                    <span className={item.correctOption.includes(2)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,2)}}>2</span>
                    <span className={item.correctOption.includes(3)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,3)}}>3</span>
                    <span className={item.correctOption.includes(4)?styles.selectionBoxSelected:styles.selectionBox} onClick={() => {onOptionPress(item,4)}}>4</span>
                  </div>
                  <div className={styles.optionContainer}>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang1: item.option1}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang1": "option1")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang1: item.option1)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 1</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang2: item.option2}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang2": "option2")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang2: item.option2)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 2</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang3: item.option3}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang3": "option3")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang3: item.option3)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 3</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang4: item.option4}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang4": "option4")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang4: item.option4)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 4</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.languageFlag? item.optionLang5: item.option5}
                          onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "optionLang5": "option5")}
                        />
                        <label htmlFor={"question"+item.count} className={(item.languageFlag? item.optionLang5: item.option5)?"active": ""}>{item.languageFlag? "विकल्प": "Option"} 5</label>
                      </div>
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
                  <div className="input-field">
                    <textarea id={"explaination"+item.count} type="text" className="materialize-textarea"
                      value={item.languageFlag? item.explainationLang: item.explaination}
                      onChange={(e)=>setQuestionProperty(e.target.value, item, item.languageFlag? "explainationLang": "explaination")}
                    />
                    <label htmlFor={"explaination"+item.count} className={(item.languageFlag? item.explainationLang: item.explaination)?"active": ""}>{item.languageFlag? "विवरण": "Explanation"}</label>
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
    </form>
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