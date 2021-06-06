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
import { faLanguage, faTimes, faArrowLeft, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Edit.module.css';
import { functions } from 'lodash';

export default function ObjectEdit({user}) {
  const router = useRouter()
  const object = router.query.object;
  const subjectId = parseInt(router.query.sId);
  const categoryId = parseInt(router.query.cId);
  const subTopicId = parseInt(router.query.stId);
  const objectId = parseInt(router.query.id);

  const [key, setKey] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [objectTitle, setObjectTitle] = useState('');
  const [timeDuration, setTimeDuration] = useState('');
  const questionObject = {
    id: 0,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    questionLang: '',
    optionLang1: '',
    optionLang2: '',
    optionLang3: '',
    optionLang4: '',
    explaination: '',
    explainationLang: '',
    videoUrl: '',
    videoUrlId: '',
    weightage: 1,
    negativeWeightage: 0,
    correctOption: [],
    isMultiple: false,
  };
  const [questionsList, setQuestionsList] = useState([questionObject]);
  const [languageFlag, setLanguage] = useState(false);
  const [instructions, setInstructions] = useState('');

  //API Calls
  useEffect(() => {
    if (objectId) {
      axios
        .get('/' + object + '/get' + object + 'Detail', {
          params: {
            id: objectId,
          },
        })
        .then((response) => {         
          if (response.data) {
            setQuestionsList(response.data);
          }
        })
        .catch((err) => {
          console.log(err);
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
          console.log(err);
        });
    } 
  }, []);

  const submitTest = (event) => {
    event.preventDefault();
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
        console.log(err);
      });
    } else if(object =='quiz'){
      axios
      .post('/quiz/postQuiz', {
        subTopicId: subTopicId,
        subjectId: subjectId,
        categoryId: catergoryId,
        quizId: objectId,
        questions: questionsList,
        quizName: objectTitle,
        quizTime: parseFloat(timeDuration),
      })
      .then((response) => {
        setIsSubmit(false);
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
        console.log(err);
      });
    }
  };

  // Normal Functions
  const isMultiple = (bool) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions[key].isMultiple = bool;
    setQuestionsList(questions);
  };

  const saveQuestion = (val) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (languageFlag) {
      questions[key].questionLang = val;
    } else {
      questions[key].question = val;
    }
    setQuestionsList(questions);
  };

  const saveOption = (val, index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (languageFlag) {
      questions[key]['optionLang' + index] = val;
    } else {
      questions[key]['option' + index] = val;
    }
    setQuestionsList(questions);
  };

  const saveWeightage = (val, flag = true) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (flag) {
      questions[key].weightage = val;
    } else {
      questions[key].negativeWeightage = val;
    }
    setQuestionsList(questions);
  };

  const saveExplanation = (val) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (languageFlag) {
      questions[key].explainationLang = val;
    } else {
      questions[key].explaination = val;
    }
    setQuestionsList(questions);
  };

  const getQueryParams = (params, url) => {
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  const saveVideoUrl = (val) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions[key].videoUrl = val;
    questions[key].videoUrlId = getQueryParams('v', val);
    if (!questions[key].videoUrlId) {
      questions[key].videoUrlId = val.split('.be/')[1];
    }
    setQuestionsList(questions);
  };

  const validateQuiz = () => {
    return (
      questionsList[key].question &&
      questionsList[key].option1 &&
      questionsList[key].option2 &&
      questionsList[key].option3 &&
      questionsList[key].option4 &&
      questionsList[key].correctOption.length
    );
  };

  const deleteQuestion = (index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    console.log(questions);
    questions.splice(index, 1);
    console.log(questions);
    setQuestionsList(questions);
    setKey(index - 1);
  };

  const onOptionPress = (index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (
      questions[key].correctOption.includes(index) &&
      questions[key].isMultiple
    ) {
      questions[key].correctOption.splice(
        questions[key].correctOption.indexOf(index),
        1,
      );
    } else if (
      questions[key].correctOption.includes(index) &&
      !questions[key].isMultiple
    ) {
      questions[key].correctOption = [];
    } else {
      if (questions[key].isMultiple) {
        questions[key].correctOption.push(index);
        questions[key].correctOption.sort();
      } else {
        questions[key].correctOption = [];
        questions[key].correctOption.push(index);
      }
    }
    setQuestionsList(questions);
  };

  const isQuestionValid = (item) => {
    return item.count%2==1?true:false;
  }

  const navigateBack = (index) => {
    //To save and navigate back.
    confirmAlert({
      title: 'Go back',
      message: 'All the changes will be erased. Are you sure to do this.',
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
    <form className={styles.container}>
      <div className={styles.pageHeader}> 
        <FontAwesomeIcon className={styles.back} size="1x" icon={faArrowLeft} onClick={() => navigateBack()}/>
        <div>
          <button className={styles.buttonDelete} onClick={(e)=>submitTest(e)}>
            Delete
          </button>
          <button className={styles.button} onClick={(e)=>submitTest(e)}>
            Save
          </button>
          <button className={styles.button} onClick={(e)=>{
              e.preventDefault();
              submitTest(e);
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
              <input id="title" type="text"
                value={objectTitle}
                onChange={(e)=>setObjectTitle(e.target.value)}
              />
              <label htmlFor="title" className={objectTitle?"active": ""}>{countString(1)} Title</label>
            </div>
          </div>
          <div className={styles.timeDuration}>
            <div className="input-field">
              <input type="number"
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
            (questionsList.map(item => {
              return (
                <div key={item.id} className={isQuestionValid(item)? styles.question : styles.questionWrong}>
                  <div>
                    <div className="input-field">
                      <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                        value={item.question}
                        onChange={(e)=>setInstructions(e.target.value)}
                      />
                      <label htmlFor={"question"+item.count} className={item.question?"active": ""}>Question {item.count}</label>
                    </div>
                    {/* <div className="row">
                      <div className="input-field">
                        <textarea id={"questionLang"+item.count} type="text" className="materialize-textarea"
                          value={item.questionLang}
                          onChange={(e)=>setInstructions(e.target.value)}
                        />
                        <label htmlFor={"questionLang"+item.count} className={item.questionLang?"active": ""}>प्रश्न {item.count}</label>
                      </div>
                    </div> */}
                  </div>
                  <div className={styles.optionSelection}>
                    <span className={styles.selectionBox}>1</span>
                    <span className={styles.selectionBox}>2</span>
                    <span className={styles.selectionBoxSelected}>3</span>
                    <span className={styles.selectionBox}>4</span>
                  </div>
                  <div className={styles.optionContainer}>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.option1}
                          onChange={(e)=>setInstructions(e.target.value)}
                        />
                        <label htmlFor={"question"+item.count} className={item.question?"active": ""}>Option 1</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.option2}
                          onChange={(e)=>setInstructions(e.target.value)}
                        />
                        <label htmlFor={"question"+item.count} className={item.question?"active": ""}>Option 2</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.option3}
                          onChange={(e)=>setInstructions(e.target.value)}
                        />
                        <label htmlFor={"question"+item.count} className={item.question?"active": ""}>Option 3</label>
                      </div>
                    </div>
                    <div className={styles.optionBox}>
                      <div className="input-field">
                        <textarea id={"question"+item.count} type="text" className="materialize-textarea"
                          value={item.option4}
                          onChange={(e)=>setInstructions(e.target.value)}
                        />
                        <label htmlFor={"question"+item.count} className={item.question?"active": ""}>Option 4</label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.footerContainer}>
                    <div className={styles.weightage}>
                      <div className={styles.weightageChild}>
                        <div className="input-field">
                          <input type="number"
                            id="number" 
                            value={timeDuration}
                            onChange={(e)=>setTimeDuration(e.target.value)}
                          />
                          <label htmlFor="number" className={timeDuration?"active": ""}>Positive</label>
                        </div>
                      </div>
                      <div className={styles.weightageChild}>
                        <div className="input-field">
                          <input type="number"
                            id="number" 
                            value={timeDuration}
                            onChange={(e)=>setTimeDuration(e.target.value)}
                          />
                          <label htmlFor="number" className={timeDuration?"active": ""}>Negative</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <FontAwesomeIcon className={styles.questionIcon} size="1x" icon={faLanguage} onClick={() => navigateBack()}/>
                      <FontAwesomeIcon className={isQuestionValid(item)?styles.questionIcon2: styles.questionIcon2Wrong} size="1x" icon={faTrashAlt} onClick={() => navigateBack()}/>
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