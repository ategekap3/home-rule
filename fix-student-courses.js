// seed-and-fix-students.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// 1️⃣ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7PMGyiHPu4g3TN4RpaoW9tvhBMPSelOI",
  authDomain: "mcwug-c060a.firebaseapp.com",
  projectId: "mcwug-c060a",
  storageBucket: "mcwug-c060a.appspot.com",
  messagingSenderId: "166616855811",
  appId: "1:166616855811:web:01072879268c874dc9a536",
  measurementId: "G-ZHD6ECPY8B"
};

// 2️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3️⃣ Default courses to seed if none exist
const defaultCourses = [
  { id: "computer_repair_maintenance", title: "Computer Repair & Maintenance", description: "Learn to repair and maintain computers", enrolledStudents: [] },
  { id: "web_development_basics", title: "Web Development Basics", description: "Learn HTML, CSS, JS", enrolledStudents: [] },
  { id: "react_basics", title: "React Basics", description: "Learn fundamentals of React", enrolledStudents: [] }
];

async function seedCourses() {
  const coursesSnap = await getDocs(collection(db, "courses"));
  if (coursesSnap.empty) {
    console.log("Seeding default courses...");
    for (const course of defaultCourses) {
      await setDoc(doc(db, "courses", course.id), course);
      console.log(` - Added course: ${course.title}`);
    }
  } else {
    console.log("Courses already exist, skipping seeding.");
  }
}

async function fixStudents() {
  const coursesSnap = await getDocs(collection(db, "courses"));
  const courses = coursesSnap.docs.map(doc => ({ id: doc.id, title: doc.data().title }));

  const studentsSnap = await getDocs(collection(db, "students"));
  console.log(`Found ${studentsSnap.size} students.`);

  for (const studentDoc of studentsSnap.docs) {
    const student = studentDoc.data();
    const studentRef = doc(db, "students", studentDoc.id);

    console.log(`\nProcessing student: ${student.firstName} ${student.lastName}`);

    if (!student.enrolledCourses || student.enrolledCourses.length === 0) {
      const enrolledCourses = [];

      // If student has "course" field, match it to a course ID
      if (student.course) {
        const matchedCourse = courses.find(c => c.title === student.course);
        if (matchedCourse) {
          enrolledCourses.push(matchedCourse.id);
          console.log(` - Matched course "${student.course}" -> ID: ${matchedCourse.id}`);
        } else {
          console.log(` - No matching course found for "${student.course}"`);
        }
      }

      if (enrolledCourses.length > 0) {
        await updateDoc(studentRef, { enrolledCourses });
        console.log(` - Updated enrolledCourses: [${enrolledCourses.join(", ")}]`);
      } else {
        console.log(" - Skipped updating enrolledCourses (empty)");
      }
    } else {
      console.log(` - Already has enrolledCourses: [${student.enrolledCourses.join(", ")}]`);
    }
  }
}

async function main() {
  await seedCourses();
  await fixStudents();
  console.log("\n✅ Firestore seeding and student fix complete!");
}

main().catch(console.error);
