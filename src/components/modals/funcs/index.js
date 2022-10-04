import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../../firebase";

// check if class Exists and remove
const existanceCheck = async (id) => {
  const classRef = doc(firestoreDb, "class", id);
  const classSnap = await getDoc(classRef);
  if (classSnap.exists()) {
    return true;
  } else {
    return false;
  }
};
const checkClassExists = async (teacherId) => {
  const teacherRef = doc(firestoreDb, "teachers", teacherId);
  const teacherSnap = await getDoc(teacherRef);
  var teacher = teacherSnap.data();
  teacher.class.map((oneClass) => {
    if (!existanceCheck(oneClass)) {
      removeSingleClassToTeacher(oneClass, teacher);
    }
  });
};

// check if course Exists and remove
const existanceCheckcourse = async (id) => {
  const classRef = doc(firestoreDb, "courses", id);
  const classSnap = await getDoc(classRef);
  if (classSnap.exists()) {
    return true;
  } else {
    return false;
  }
};
const checkCourseExists = async (teacherId) => {
  const teacherRef = doc(firestoreDb, "teachers", teacherId);
  const teacherSnap = await getDoc(teacherRef);
  var teacher = teacherSnap.data();
  console.log(teacher);
  teacher.course.map((oneClass) => {
    if (existanceCheckcourse(oneClass) == false) {
      console.log("data");
      removeSingleCourseToTeacher(oneClass, teacher);
    }
  });
};

//  Course is created
const addSingleCourseToClass = async (classId, courseId) => {
  const classRef = doc(firestoreDb, "class", classId);
  await updateDoc(classRef, {
    course: arrayUnion(courseId),
  });
};
const removeSingleCourseFromClass = async (classId, courseId) => {
  const classRef = doc(firestoreDb, "class", classId);
  await updateDoc(classRef, {
    course: arrayRemove(courseId),
  });
};

// Class Is Created
const addSingleClassToCourse = async (courseId, classId) => {
  const classRef = doc(firestoreDb, "course", courseId);
  await updateDoc(classRef, {
    course: arrayUnion(classId),
  });
};
const removeSingleClassFromCourse = async (courseId, classId) => {
  const classRef = doc(firestoreDb, "course", courseId);
  await updateDoc(classRef, {
    course: arrayRemove(classId),
  });
};

// Course Is

// Add Couse To Teachers
const addSingleCourseToTeacher = async (courseId, teacherId) => {
  const teacherRef = doc(firestoreDb, "teachers", teacherId);
  await checkCourseExists(teacherId);

  await updateDoc(teacherRef, {
    course: arrayUnion(courseId),
  });
};

const removeSingleCourseToTeacher = async (courseId, teacherId) => {
  const teacherRef = doc(firestoreDb, "teachers", teacherId);
  await updateDoc(teacherRef, {
    course: arrayRemove(courseId),
  });
};

// add class to teacher
const addSingleClassToTeacher = async (classId, teacherId) => {
  await checkClassExists(teacherId);
  const teacherRef = doc(firestoreDb, "teachers", teacherId);
  await updateDoc(teacherRef, {
    class: arrayUnion(classId),
  });
};
const removeSingleClassToTeacher = async (classId, teacherId) => {
  const teacherRef = doc(firestoreDb, "teachers", teacherId);
  await updateDoc(teacherRef, {
    course: arrayRemove(classId),
  });
};

// Teachers
const addSingleTeacherToCourse = async (teacherId, courseId) => {
  await checkClassExists(teacherId);
  const teacherRef = doc(firestoreDb, "courses", courseId);
  await updateDoc(teacherRef, {
    teachers: arrayUnion(teacherId),
  });
};
const removeTeacherClassfromCourse = async (teacherId, courseId) => {
  const teacherRef = doc(firestoreDb, "courses", courseId);
  await updateDoc(teacherRef, {
    teachers: arrayRemove(teacherId),
  });
};

export {
  addSingleTeacherToCourse,
  removeTeacherClassfromCourse,
  addSingleCourseToClass,
  removeSingleCourseFromClass,
  addSingleClassToCourse,
  removeSingleClassFromCourse,
  addSingleCourseToTeacher,
  removeSingleCourseToTeacher,
  addSingleClassToTeacher,
  removeSingleClassToTeacher,
};
