import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

//  Course is created
const addSingleCourseToClass = async (classId, courseId) => {
  const classRef = doc(db, "class", classId);
  await updateDoc(classRef, {
    course: arrayUnion(courseId),
  });
};
const removeSingleCourseFromClass = async (classId, courseId) => {
  const classRef = doc(db, "class", classId);
  await updateDoc(classRef, {
    course: arrayRemove(courseId),
  });
};

// Class Is Created
const addSingleClassToCourse = async (courseId, classId) => {
  const classRef = doc(db, "course", courseId);
  await updateDoc(classRef, {
    course: arrayUnion(classId),
  });
};
const removeSingleClassFromCourse = async (courseId, classId) => {
  const classRef = doc(db, "course", courseId);
  await updateDoc(classRef, {
    course: arrayRemove(classId),
  });
};

// Remove Students From Class
export {
  addSingleCourseToClass,
  removeSingleCourseFromClass,
  addSingleClassToCourse,
  removeSingleClassFromCourse,
};
