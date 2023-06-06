import "./App.css";
import react, { useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import userEvent from "@testing-library/user-event";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXHDBw4pM3xiTbZ4ee07UKIgYbJu_yoGY",
  authDomain: "to-do-site-ef845.firebaseapp.com",
  projectId: "to-do-site-ef845",
  storageBucket: "to-do-site-ef845.appspot.com",
  messagingSenderId: "898726289631",
  appId: "1:898726289631:web:e03b27b5eb62bdda86896a",
};

const Home = () => {
  //Initialize Firebase
  initializeApp(firebaseConfig);
  //initialize user authentication
  const db = getFirestore();

  const auth = getAuth();
  const colRef = collection(db, "project");
  const [deleteID, setDeleteID] = useState();
  const [newProjName, setNewProjName] = useState();
  const [newProjDesc, setNewProjDesc] = useState();
  const [newProjNext, setNewProjNext] = useState();
  const [updateProjName, setUpdateProjName] = useState();
  const [updateProjDesc, setUpdateProjDesc] = useState();
  const [updateProjNext, setUpdateProjNext] = useState();

  const { oldProjName, setOldProjName } = useState();
  const [projects, setProjects] = useState();
  const [updateID, setUpdateID] = useState();
  const [projectArray, setProjectArray] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loggedIn, setLoggedIn] = useState();
  //"project" items have an auto generated ID, a name, a description (desc), and a to do next (next)

  const getDocuments = async () => {
    let data = [];
    getDocs(colRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        console.log(data);
        setProjectArray(data);
        const projectDivs = data.map((element) => (
          <div class="div1">
            Name: {element.name}
            <br></br>
            Description: {element.desc}
            <br></br>
            To Do Next: {element.next}

  {
              <button class="button5"
                
                onClick={() => {
                  data.forEach((project) => {
                    console.log(project.name);
                    if (project.name == element.name) {
                      deleteDoc(doc(db, 'project', element.id));
                      console.log(element.name + " has been deleted");
                      getDocuments();
                    }
                  });
                }}
                >
                delete
                </button> 
  }
           </div>

        ));
        setProjects(projectDivs);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  

  useEffect(() => {
    console.log("useEffect ran");
    getDocuments();
    console.log("project array: ", projectArray);
    
  }, []);

  return (
    <html>
      <div id="grid">
        <div id="sidebar">
          {loggedIn ? (
            <button
              class="button4"
              onClick={() => {
                signOut(auth)
                  .then(() => {
                    console.log("user signed out");
                    setLoggedIn(false);
                    console.log("logged in: ", loggedIn);
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              }}
            >
              L o g o u t
            </button>
          ) : (
            <></>
          )}
        </div>
        <div id="main">
          <div id="left">
            {loggedIn ? (
              <div>
                <div class="div1">
                  Create Project:
                  <br></br>
                  <label>Project Name:</label>
                  <input
                    onChange={(e) => setNewProjName(e.target.value)}
                    value={newProjName}
                  />
                  <label>Project Description:</label>
                  <input
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    value={newProjDesc}
                  />
                  <label>Next Steps:</label>
                  <input
                    onChange={(e) => setNewProjNext(e.target.value)}
                    value={newProjNext}
                  />
                  <br></br>
                  <div className="button-container">
                    <button
                      class="button3"
                      onClick={() => {
                        addDoc(colRef, {
                          name: newProjName,
                          desc: newProjDesc,
                          next: newProjNext,
                        }).then(() => {
                          console.log(
                            "new project created, name: " + newProjName
                          );
                          getDocuments();
                        });
                        setNewProjName("");
                        setNewProjNext("");
                        setNewProjDesc("");
                      }}
                    >
                      Add Project
                    </button>
                  </div>
                </div>
                {/* lower boundary of div */}
                <div class="div1">
                  Update Project:
                  <br></br>
                  <label>Old Project Name:</label>
                  <input
                    onChange={(e) => setUpdateProjName(e.target.value)}
                    value={updateProjName}
                  />
                  <label>New Description:</label>
                  <input
                    onChange={(e) => setUpdateProjDesc(e.target.value)}
                    value={updateProjDesc}
                  />
                  <label>Updated Next Steps:</label>
                  <input
                    onChange={(e) => setUpdateProjNext(e.target.value)}
                    value={updateProjNext}
                  />
                  <br></br>
                  <div className="button-container">
                    <button
                      class="button3"
                      onClick={() => {
                        setUpdateID("");
                        projectArray.forEach((project) => {
                          if (updateProjName === project.name) {
                            setUpdateID(project.id);
                            console.log(updateID);
                          }
                        });
                        
                          let docRef = doc(db, "project", updateID);
                          updateDoc(docRef, {
                            desc: updateProjDesc,
                            next: updateProjNext,
                          })
                          getDocuments();
                          setUpdateProjName("");
                          setUpdateProjNext("");
                          setUpdateProjDesc("");
                        
                        
                      }}
                    >
                      Update Project
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div class="div1">
                  Create a New Account
                  <br></br>
                  <label>Email:</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <br></br>
                  <label>Password:</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className="button-container">
                    <button
                      class="button3"
                      onClick={() => {
                        createUserWithEmailAndPassword(auth, email, password)
                          .then((cred) => {
                            console.log("cred user: ", cred.user);
                            setLoggedIn(true);
                            console.log(loggedIn);
                          })
                          .catch((err) => {
                            console.log("error message starts: ", err.message);
                            if (
                              err.message ===
                              "Firebase: Error (auth/email-already-in-use)."
                            ) {
                              signInWithEmailAndPassword(auth, email, password)
                                .then((cred) => {
                                  console.log("cred user: ", cred.user);
                                  setLoggedIn(true);
                                  console.log(loggedIn);
                                })
                                .catch((err) => {
                                  console.log(err.message);
                                });
                            }
                          });
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div id="right">
            {loggedIn ? (
              <div>{projects}</div>
            ) : (
              <>
                <h1>Log In or Sign Up to view projects</h1>
               
              </>
            )}
          </div>
        </div>
      </div>
    </html>
  );
};

export default Home;
