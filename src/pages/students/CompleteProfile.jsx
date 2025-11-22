// src/pages/students/CompleteProfile.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../components/firebase";
import { doc, setDoc, serverTimestamp, addDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";

const courses = [
  { id: "fundamentals-it", name: "FUNDAMENTALS OF IT" },
  { id: "graphics-design", name: "GRAPHICS DESIGN" },
  { id: "programming", name: "PROGRAMMING" },
  { id: "ms-office", name: "MS.OFFICE" },
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    secondName: "",
    course: courses[0].id,
    nationality: "",
    dob: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // require a signed-in phone user
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        navigate("/phone-login");
        return;
      }
      setUser(u);
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    // prefill whatsapp from auth user
    if (user) {
      // user.phoneNumber is like +2567...
      setForm((f) => ({ ...f, whatsapp: user.phoneNumber || "" }));
    }
  }, [user]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.secondName || !form.course) {
      setError("First name, second name and course are required.");
      return;
    }
    if (!user) { setError("User not signed in."); return; }

    setSaving(true);
    try {
      const uid = user.uid;
      const studentRef = doc(db, "students", uid);

      // Save basic student doc (if exists, overwrite/update)
      await setDoc(studentRef, {
        uid,
        firstName: form.firstName,
        secondName: form.secondName,
        course: form.course,
        whatsapp: user.phoneNumber || "",
        nationality: form.nationality || "",
        dob: form.dob || "",
        enrolledCourses: arrayUnion(form.course), // add selected course
        progress: [], 
        certificates: [],
        notifications: [],
        createdAt: serverTimestamp(),
      }, { merge: true });

      // send welcome message
      await addDoc(collection(db, "messages"), {
        senderId: "admin",
        receiverId: uid,
        text: `Welcome ${form.firstName} to Modern Computer World UG!`,
        timestamp: serverTimestamp(),
        read: false,
      });

      navigate("/student-dashboard");
    } catch (err) {
      console.error("save profile error", err);
      setError("Failed to save profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null; // small guard; redirect handled in effect

  return (
    <div className="student-portal-container">
      <form className="student-form" onSubmit={handleSave}>
        <h2>Complete Your Profile</h2>

        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
        <input type="text" name="secondName" placeholder="Second Name" value={form.secondName} onChange={handleChange} />

        <select name="course" value={form.course} onChange={handleChange}>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input type="text" name="whatsapp" placeholder="WhatsApp (read-only)" value={user.phoneNumber || ""} readOnly />
        <input type="text" name="nationality" placeholder="Nationality (optional)" value={form.nationality} onChange={handleChange} />
        <input type="date" name="dob" value={form.dob} onChange={handleChange} />

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
