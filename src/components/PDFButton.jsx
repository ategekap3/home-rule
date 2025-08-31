import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PDFButton = ({ children, filename }) => {
  const ref = useRef();

  const handleDownload = async () => {
    const element = ref.current;
    if(!element) return;
    const canvas = await html2canvas(element, { useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename || 'document.pdf');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div ref={ref} style={{ display: 'inline-block', padding: '1rem', border: '1px solid #eee' }}>
        {children}
      </div>
      <button onClick={handleDownload} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Download PDF</button>
    </div>
  );
};

export default PDFButton;
