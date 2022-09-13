import React, { useState, useEffect ,useRef } from 'react'
import { Form, Input, Button, Select, Modal, message,Row, Col } from 'antd';
import { useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from "moment";
import {
    doc,
    setDoc,
    getDocs,
    collection,
    where,
    query,
    updateDoc,
} from "firebase/firestore";
import { firestoreDb, storage } from "../../../firebase";
import uuid from "react-uuid";

const { Option } = Select;

function Update({ handleCancel, handleUpdateCancel ,  openUpdate, data, updateComplete, setUpdateComplete, }) {

    const uid = useSelector((state) => state.user.profile);
    const [courses , setCourses] =useState({})
    const [allPhone, setAllPhone] = useState([]);
    const [input, setInputs] = useState([0]);
    const [phone, setPhones] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState("");
    const [images , setImages] = useState(null);
    const [percent, setPercent] = useState(0);
    const [classData, setClassData] = useState([]);
    const [coursesData ,setCourseData]= useState([]);
    const [personData, setPersonData] = useState([]);
  const [secData, setSecData] = useState([]);
    const [updateTeacher, setUpdateTeacher] = useState({
        id: data.id,
        avater: data.avater,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        class: data.class,
        course: data.course,
        level: data.level,
        phone: data.phone,
        school_id: data.school_id,
    });


    const valueRef = useRef();

  const handleChange =(event) =>{
    setFile(event.target.files[0]);
  }; 
 
//  async function handleUpload()  {
//     if (!file) {
//       alert("Please choose a file first!");
//     }
    
//     const storageRef = ref(storage, file.name);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const percent = Math.round(
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         );

//         // update progress
//         setPercent(percent);
//       },
//       (err) => console.log(err),
//       () => {
//         // download url
//         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//           console.log("url is   ",url)
//           valueRef.current = url
//           console.log("value with ref is ",valueRef.current)
          
//           if(valueRef.current != null){
//           console.log("value with ref with ref is ",valueRef.current)
//           setLoading(true)
//           setUpdateTeacher({...updateTeacher , avater: valueRef.current})
//           if(updateTeacher.avater !==null){
//            console.log("Teacher  is createteacher    " ,updateTeacher);
//            console.log("teacher id   ", data.id)
//           setLoading(false)
//           }
//           }
//         console.log("images is   ",images)         
//         });
//       }
//     );
//   }

    const handleUpdate =  () => {
        setLoading(true);
        if (!file) {
          setDoc(doc(firestoreDb, "teachers", data.key), updateTeacher, { merge: true }).then(
              response => {
                  setLoading(false)
                  message.success("Data is updated successfuly")
                  setUpdateComplete(!updateComplete)
                  handleUpdateCancel()
              })
              .catch(error => {
                  message.error("Data is not updated")
                  console.log(error)
              })
      } else {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percentR = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percentR);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {

                    valueRef.current = url
                    if (valueRef.current != null) {
                        updateTeacher.avater = valueRef.current;

                        if (updateTeacher.avater !== null) {
                            setDoc(doc(firestoreDb, "teachers", data.key), updateTeacher, { merge: true }).then(
                                response => {
                                    setLoading(false)
                                    message.success("Data is updated successfuly")
                                    setUpdateComplete(!updateComplete)
                                    handleUpdateCancel()
                                })
                                .catch(error => {
                                    message.error("Data is not updated")
                                    console.log(error)
                                })
                        }
                    }

                });
            }
        );

    }
       
    }
    const getClass = async () => {

        const children = [];

        const q = query(
            collection(firestoreDb, "class"),
            where("school_id", "==", uid.school)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var datas = doc.data();
            children.push({
                ...datas,
                key: doc.id,
            });
        });

        setClassData(children);
    };

    const getSection = async () => {

        const sec =[]
        const q = query(
          collection(firestoreDb, "sections"),
          where("school_id", "==", uid.school)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          var datas = doc.data();
          sec.push({
            ...datas,
            key: doc.id,
          });
        });
        setSecData(sec);
      };

      const getCourse = async () => {
        const coursess = []
        const q = query(
          collection(firestoreDb, "courses"),
          where("school_id", "==", uid.school)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          var datas = doc.data();
          coursess.push({
            ...datas,
            key: doc.id,
          });
        });
        setCourseData(coursess);
      };
    

    useEffect(() => {
        getClass();
        getCourse();
        getSection();   
    }, []);

    const children = [];
    const handleCourse = (value) => {
      setUpdateTeacher({ ...updateTeacher, class: value });
    };
  
    const handleSection = (value) => {
      setUpdateTeacher({ ...updateTeacher, level: value });
    };
      
    
    const handleCourses = (value) => {
      setUpdateTeacher({ ...updateTeacher, course: value });
        };
      // const handlename = (value) => {
      //  setNewUser({ ...newUser, first_name: value });
      //   };
  
    const setEmail = (e) => {
      setUpdateTeacher({ ...updateTeacher, email: e.target.value });
    };
    const setPhone = (e) => {
      if (!e) {
        alert("Please write phone first!");
      }
      setUpdateTeacher({ ...updateTeacher, phone: e.target.value });
    };
    const setFirstNmae = (e) => {
      setUpdateTeacher({ ...updateTeacher, first_name: e.target.value });
    };
    const setLastName = (e) => {
      setUpdateTeacher({ ...updateTeacher, last_name: e.target.value });
    };

    const onChange = (e) => {
      setUpdateTeacher({ ...updateTeacher, [e.target.name]: e.target.value })
  }
    return (
        <div>
            {data && openUpdate ?
                <Modal
                    visible={openUpdate}
                    title="Update Course"
                    onCancel={handleCancel}
                    width={756}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type='primary' loading={loading} onClick={handleUpdate}>
                          {percent ? percent + "%" : null} 
                            Update
                        </Button>,

                    ]}
                >

            
            <Row>               
               <Col style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img src={file ? URL.createObjectURL(file) : data.avater}  alt="" style={{ width: "330px" }} />
                    </Col>
    <Col style={{ width: "50%", padding: "20px" }}>
               <Form
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
      >
        <Form.Item label="Class">
          <Select
            style={{
              width: "100%",
            }}
            defaultValue={data.class}
            placeholder="select all classes"
            onChange={handleCourse}
            optionLabelProp="label"
            mode="multiple"
          >
            {classData.map((item, index) => (
              <Option  key={item.key} value={item.grade} label={item.grade}>
                {item.grade}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Courses">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all courses"
            defaultValue={data.course}
            onChange={handleCourses}
            optionLabelProp="label"
            mode="multiple"
          
          >
            {coursesData.map((item, index) => (
              <Option   key={item.key} value={item.name} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="First Name">
          <Input defaultValue={data.first_name} name="first_name" onChange={(e) => onChange(e)} />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input defaultValue={data.last_name} name="last_name" onChange={(e) => onChange(e)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input defaultValue={data.email} name="email" onChange={(e) => onChange(e)}/>
        </Form.Item>
        <Form.Item label="Phone">
        <Input  defaultValue={data.phone} name="phone" onChange={(e) => onChange(e)} />

        </Form.Item>
        <Form.Item label="Level">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="select all level"
            onChange={handleSection}
            defaultValue={data.level}
            optionLabelProp="label"
          >
            {secData.map((item, index) => (
              <Option  key={item.key}value={item.name} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Teacher Pictue" valuePropName="fileList">
          <input type="file" onChange={handleChange} accept="/image/*"   />
        </Form.Item>

                    </Form>
                    </Col>
                </Row>

                </Modal>
                : null}
        </div>
    )
}

export default Update