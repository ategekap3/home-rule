import React, { useState, useEffect } from "react";
import { auth, db } from "../../components/firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  query,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopStats from "./TopStats";
import ProfileCard from "./ProfileCard";
import NotificationsPanel from "./Notifications";
import MessagePanel from "./MessagePanel";

import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpeg";

import "./StudentDashboard.css";

const coursesList = [
  { id: "fundamentals-it", name: "FUNDAMENTALS OF IT", fees: "UGX. 450,000", image: img1, description: "Learn computer basics, internet, hardware, software & IT fundamentals." },
  { id: "graphics-design", name: "GRAPHICS DESIGN", fees: "UGX. 800,000", image: img2, description: "Master Photoshop, Illustrator, Canva & other design tools." },
  { id: "programming", name: "PROGRAMMING", fees: "UGX. 1,000,000", image: img3, description: "Learn HTML, CSS, JavaScript, React, and backend basics." },
  { id: "ms-office", name: "MS.OFFICE", fees: "UGX. 500,000", image: img4, description: "Includes Word, Excel, Access, PowerPoint, Publisher & Outlook with free installations." },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [hoveredCourse, setHoveredCourse] = useState(null);

  // Fetch student data
  useEffect(() => {
    if (!user) navigate("/student-login");

    const unsubscribe = onSnapshot(doc(db, "students", user.uid), (snap) => {
      if (snap.exists()) setStudent({ id: snap.id, ...snap.data() });
    });

    return () => unsubscribe();
  }, [user, navigate]);

  // Fetch messages
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map((doc) => doc.data())
        .filter((m) => m.senderId === "admin" && m.receiverId === user.uid);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/student-login");
  };

  const handleEnroll = async (courseId) => {
    if (!student) return;
    const studentRef = doc(db, "students", student.id);
    try {
      await updateDoc(studentRef, {
        enrolledCourses: arrayUnion(courseId),
      });
      alert("Successfully enrolled!");
    } catch (err) {
      console.error(err);
      alert("Enrollment failed!");
    }
  };

  if (!student) return <p>Loading student data...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar active={activeTab} setActive={setActiveTab} handleLogout={handleLogout} />

      <main className="dashboard-main">
        {/* Dashboard main */}
        {activeTab === "Dashboard" && !selectedCourse && (
          <>
            <TopStats
              coursesCount={student.enrolledCourses?.length || 0}
              completedCount={student.progress?.length || 0}
              certificatesCount={student.certificates?.length || 0}
            />

            <div className="available-courses-section">
              <h2>Courses</h2>
              <div className="courses-grid">
                {coursesList.map((course) => {
                  const isEnrolled = student.enrolledCourses?.includes(course.id);
                  const completed = student.progress?.includes(course.id);
                  const progressPercentage = completed ? 100 : isEnrolled ? 50 : 0;

                  return (
                    <div
                      key={course.id}
                      className="course-card"
                      onClick={() => setSelectedCourse(course)}
                      onMouseEnter={() => setHoveredCourse(course.id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    >
                      <img src={course.image} alt={course.name} className="course-image" />
                      <div className="course-info">
                        <h3>{course.name}</h3>
                        <p className="course-fees">{course.fees}</p>

                        {isEnrolled && (
                          <>
                            <div className="progress-container">
                              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <p className="progress-text">{progressPercentage}% completed</p>
                          </>
                        )}

                        {isEnrolled ? (
                          <span className="enrolled-badge">Enrolled</span>
                        ) : (
                          <button
                            className="btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnroll(course.id);
                            }}
                          >
                            Enroll
                          </button>
                        )}

                        {completed && <span className="certificate-badge completed">Certificate available!</span>}
                      </div>

                      {/* Hover Description */}
                      {hoveredCourse === course.id && (
                        <div className="hover-description">{course.description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Course Detail View */}
        {selectedCourse && (
          <div className="course-details">
            <button
              className="btn-primary"
              onClick={() => setSelectedCourse(null)}
              style={{ marginBottom: "1rem", backgroundColor: "#dc3545" }}
            >
              Back to Courses
            </button>

            <div className="course-details-card">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.name}
                className="course-image-large"
              />
              <div className="course-info">
                <h2>{selectedCourse.name}</h2>
                <p className="course-fees">{selectedCourse.fees}</p>
                <p>{selectedCourse.description}</p>

                {student.enrolledCourses?.includes(selectedCourse.id) ? (
                  <>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: student.progress?.includes(selectedCourse.id) ? "100%" : "50%",
                        }}
                      ></div>
                    </div>
                    <p className="progress-text">
                      {student.progress?.includes(selectedCourse.id) ? "100% completed" : "In progress"}
                    </p>
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => handleEnroll(selectedCourse.id)}
                  >
                    Enroll in this course
                  </button>
                )}

                {student.progress?.includes(selectedCourse.id) && (
                  <span className="certificate-badge completed">Certificate available!</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages & Notifications */}
        {activeTab === "Messages" && <MessagePanel messages={messages} user={user} />}
        {activeTab === "Notifications" && <NotificationsPanel notifications={student.notifications} />}
        {activeTab === "Profile" && <ProfileCard student={student} />}
      </main>
    </div>
  );
};

export default StudentDashboard;