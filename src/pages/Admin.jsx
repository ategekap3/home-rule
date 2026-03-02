import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../components/firebase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./Admin.css";

// Ensure this path is correct for your project
import logo from "../assets/logo.jpeg";

const availableCourses = [
  "FUNDAMENTALS OF IT",
  "GRAPHICS DESIGN",
  "PROGRAMMING",
  "MS.OFFICE",
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Auth Redirect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) window.location.href = "/admin-login";
    });
    return () => unsubscribe();
  }, []);

  // Real-time Student Fetch
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const getProcessedStudents = () => {
    return students.filter((s) => {
      const courseMatch = filterCourse === "All" || s.course === filterCourse;
      const statusMatch = filterStatus === "All" || (s.status || "Pending") === filterStatus;
      return courseMatch && statusMatch;
    });
  };

  // --- BRANDING LOGIC (Based on shared PDF) ---
  const applyBranding = (doc) => {
    try {
      doc.addImage(logo, "JPEG", 14, 10, 25, 25);
    } catch (e) {
      console.warn("Logo image not found");
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 153); 
    doc.text("MODERN COMPUTER WORLD UG", 45, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100); 
    doc.text('"Digitalize yourself and future"', 45, 23);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("P.O.BOX 123 KAMPALA-UGANDA", 45, 28);
    doc.text("TEL: 0509318330 | www.moderncomputerworldug.com", 45, 33);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 51, 153);
    doc.line(14, 38, 196, 38);
  };

  const addMissionFooter = (doc) => {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const mission = "Focused on training the world moves and meet with the trending technology by enabling them use a computer";
    doc.text(mission, 14, doc.internal.pageSize.height - 10);
  };

  // --- PDF DOWNLOAD ACTIONS ---

  // 1. Enrollment List PDF (Added back)
  const downloadEnrollmentPDF = () => {
    const doc = new jsPDF();
    applyBranding(doc);
    doc.setFontSize(12);
    doc.text(`STUDENT ENROLLMENT LIST - ${filterCourse}`, 14, 46);

    const rows = getProcessedStudents().map(s => [
      `${s.firstName} ${s.secondName}`,
      s.course,
      s.whatsapp,
      s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : "N/A"
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Name", "Course", "WhatsApp", "Reg. Date"]],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 153] }
    });

    addMissionFooter(doc);
    doc.save(`Enrollment_${filterCourse}.pdf`);
  };

  // 2. Finance Summary PDF
  const downloadFinanceReport = () => {
    const doc = new jsPDF();
    applyBranding(doc);
    doc.setFontSize(12);
    doc.text("FINANCE & PROGRESS REPORT", 14, 46);

    const rows = getProcessedStudents().map(s => [
      `${s.firstName} ${s.secondName}`,
      s.status || "Pending",
      (s.tuition || 0).toLocaleString(),
      (s.paid || 0).toLocaleString(),
      ((s.tuition || 0) - (s.paid || 0)).toLocaleString()
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Name", "Status", "Tuition", "Paid", "Balance"]],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69] }
    });

    addMissionFooter(doc);
    doc.save("Finance_Report.pdf");
  };

  // 3. Individual Receipt PDF
  const downloadReceipt = (s) => {
    const doc = new jsPDF();
    applyBranding(doc);
    doc.setFontSize(14);
    doc.text("OFFICIAL PAYMENT RECEIPT", 14, 48);

    autoTable(doc, {
      startY: 55,
      body: [
        ["Student Name", `${s.firstName} ${s.secondName}`],
        ["Course", s.course || "N/A"],
        ["Total Tuition", `UGX ${(s.tuition || 0).toLocaleString()}`],
        ["Amount Paid", `UGX ${(s.paid || 0).toLocaleString()}`],
        ["Balance Due", `UGX ${((s.tuition || 0) - (s.paid || 0)).toLocaleString()}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 51, 153] },
    });

    doc.text("Authorized Signature: __________________", 14, 110);
    addMissionFooter(doc);
    doc.save(`Receipt_${s.firstName}.pdf`);
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateDoc(doc(db, "students", id), data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={() => auth.signOut()}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>Enrollment</button>
        <button className={activeTab === "finance" ? "active" : ""} onClick={() => setActiveTab("finance")}>Finance & Status</button>
      </div>

      {/* --- ENROLLMENT TAB --- */}
      {activeTab === "students" && (
        <div className="table-wrapper">
          <div className="admin-controls">
            <select onChange={(e) => setFilterCourse(e.target.value)}>
              <option value="All">All Courses</option>
              {availableCourses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* ADDED BUTTON BACK HERE */}
            <button className="btn-download" onClick={downloadEnrollmentPDF}>Download Enrollment PDF</button>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Course</th><th>WhatsApp</th><th>Reg. Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {getProcessedStudents().map((s) => (
                <tr key={s.id}>
                  <td>{s.firstName} {s.secondName}</td>
                  <td>{s.course}</td>
                  <td>{s.whatsapp}</td>
                  <td>{s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : "..."}</td>
                  <td><button className="btn-danger" onClick={() => deleteDoc(doc(db, "students", s.id))}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- FINANCE & STATUS TAB --- */}
      {activeTab === "finance" && (
        <div className="table-wrapper">
          <div className="admin-controls">
            <select onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Started">Started</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="btn-download" style={{backgroundColor: '#28a745'}} onClick={downloadFinanceReport}>Download Finance PDF</button>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Status</th><th>Tuition</th><th>Paid</th><th>Balance</th><th>Set Status</th><th>Receipt</th></tr>
            </thead>
            <tbody>
              {getProcessedStudents().map((s) => (
                <tr key={s.id}>
                  <td>{s.firstName} {s.secondName}</td>
                  <td className={`status-${(s.status || "pending").toLowerCase()}`}>{s.status || "Pending"}</td>
                  <td><input type="number" defaultValue={s.tuition || 0} onBlur={(e) => handleUpdate(s.id, { tuition: Number(e.target.value) })} /></td>
                  <td><input type="number" defaultValue={s.paid || 0} onBlur={(e) => handleUpdate(s.id, { paid: Number(e.target.value) })} /></td>
                  <td style={{ fontWeight: "bold", color: (s.tuition - s.paid > 0) ? "red" : "green" }}>
                    {((s.tuition || 0) - (s.paid || 0)).toLocaleString()}
                  </td>
                  <td>
                    <select value={s.status || "Pending"} onChange={(e) => handleUpdate(s.id, { status: e.target.value, statusDate: new Date() })}>
                      <option value="Pending">Pending</option>
                      <option value="Started">Started</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td><button className="btn-send" onClick={() => downloadReceipt(s)}>Receipt</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}