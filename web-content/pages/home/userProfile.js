import _ from 'lodash';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import axios from '../../src/services/axios';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTrashAlt, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Profile.module.css';

function Profile(props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSubject, setEditSubject] = useState(0);
  const [oldCategory, setOldCategory] = useState('');
  const [newCategory, setNewCategory] = useState({categoryName: '', id: 0});
  const [profile, setProfile] = useState([]);

  //API Calls
  useEffect(() => {
    getUser();
  }, [props.id]);

  const getUser = () => {
    axios
        .get('/user/getuser/' + props.id)
        .then((response) => {         
          if (response.data) {
            setProfile(response.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
  }

  const postUser = () => {
    setSaving(true)
    if(true){
      axios
      .post('/user/updateUser', profile)
      .then((response) => {
        setSaving(false);
        setEditMode(false);
        toast.success('User saved successfully.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
        });
      })
      .catch((err) => {
        toast.error('Error posting User, contact developer.', {
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

  const deleteUser = () => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure you want to delete the user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            axios
              .delete('/user/deleteUser', profile)
              .then((response) => {
                router.back();
                toast.success('User deleted successfully.', {
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

  const updateProfile= (value, prop) => {
    // console.log("Value: " + value, ' Prop: ' + prop, ' Profile: ' + JSON.stringify(profile));
    let tempProfile = profile;
    tempProfile[prop] = value;
    console.log(tempProfile[prop])
    setProfile({...tempProfile});
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div className={styles.actionButton}>
            <button className={`btn-small waves-effect waves-light grey darken-1 left ${styles.button}`} onClick={() => props.id !== props.user.id ? props.back('users') : props.back('feed')}>
              Back
            </button>
            <button className={`btn-small waves-effect waves-light blue left ${styles.button}`} onClick={() => {editMode? postUser() :setEditMode(!editMode)}}>
              {editMode ? 'Save' : 'Edit'}
            </button>
            { props.id !== props.user.id ?
              <button className={`btn-small waves-effect waves-light red right ${styles.buttonDelete}`} onClick={() => deleteUser()}>
              Delete
            </button>
            : <></>
            }
        </div>
        <div className={styles.profileForm}>
          <div className={styles.leftModule}>
            <div className="input-field">
                <input id="firstname" type="text" required={true} aria-required={true}
                  value={profile.firstname}
                  disabled={!editMode}
                  onChange={(e)=>updateProfile(e.target.value, 'firstname')}
                />
                <label htmlFor="firstname" className={ profile.firstname ? "active" : "" }> First Name</label>
            </div>
            <div className="input-field">
                <input id="lastname" type="text" required={true} aria-required={true}
                  value={profile.lastname}
                  disabled={!editMode}
                  onChange={(e)=>updateProfile(e.target.value, 'lastname')}
                />
                <label htmlFor="lastname" className={ profile.lastname ? "active" : "" }> Last Name</label>
            </div>
            <div className="input-field">
                <input id="referralCode" type="text" required={true} aria-required={true}
                  value={profile.referralCode}
                  disabled={true}
                  onChange={(e)=>updateProfile(e.target.value, 'referralCode')}
                />
                <label htmlFor="referralCode" className={ profile.referralCode ? "active" : "" }> Last Name</label>
            </div>
            <div>
              Earned(Referral) Amount: &nbsp; {profile.TotalReferral || 0}
            </div>
          </div>
          <div className={styles.rightModule}>
            <div className="input-field">
                <input id="email" type="text" required={true} aria-required={true}
                  value={profile.email}
                  disabled={!editMode}
                  onChange={(e)=>updateProfile(e.target.value, 'email')}
                />
                <label htmlFor="email" className={ profile.email ? "active" : "" }> Email Id</label>
            </div>
            <div className="input-field">
                <input id="phone" type="text" required={true} aria-required={true}
                  value={profile.phone}
                  disabled={!editMode}
                  onChange={(e)=>updateProfile(e.target.value, 'phone')}
                />
                <label htmlFor="phone" className={ profile.phone ? "active" : "" }> Phone Number</label>
            </div>
            <label className={styles.admin}>
              <input type="checkbox" value={profile.isAdmin} checked={ profile.isAdmin ? "checked" : '' } onChange={()=> updateProfile(!profile.isAdmin, 'isAdmin')}/>
              <span className={styles.isActive}> Is Admin </span>
            </label>
            <div className={styles.wallet}>
              Wallet Amount: &nbsp; {profile.walletamount || 0}
            </div>
          </div>
          {/* <div className={styles.payment}>
            Pay to {profile.firstname + " " + profile.lastname + " :"}
            <input type="number"
                            id="number" 
                            value={profile.weightage}
                            onChange={(e)=>setQuestionProperty(e.target.value, item, "weightage")}
                          />
          </div> */}
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
export default Profile