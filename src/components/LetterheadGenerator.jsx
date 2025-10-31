import React, { useState, useRef } from 'react';
import { Download, Edit2, Eye, FileText } from 'lucide-react';

const LetterheadGenerator = () => {
  const [formData, setFormData] = useState({
    reference: 'No. SD/PERS/00944',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    salutation: 'TO WHOM IT MAY CONCERN',
    employeeName: 'Rana Waqas Kamran',
    jobTitle: 'Senior Software Engineer',
    startDate: 'July 18, 2017',
    endDate: 'November 27, 2018',
    paragraph1: 'During this tenure, he demonstrated exceptional skills in software development, problem-solving, and team collaboration. His contributions to various projects were valuable and appreciated by the management and team members.',
    paragraph2: 'We found him to be hardworking, dedicated, and professional in all aspects of his work. He has consistently shown commitment and passion throughout his employment with us.',
    paragraph3: 'We wish him all the best in his future endeavors.',
    signerName: 'Talha Khan',
    signerTitle: 'Chief Human Resource Officer'
  });

  const [isEditing, setIsEditing] = useState(true);
  const letterheadRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadAsPDF = () => {
    const element = letterheadRef.current;
    const opt = {
      margin: 0,
      filename: `SolutionDots_Letter_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: 1123
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    } else {
      alert('Installing PDF library... Please use Print to PDF option (Ctrl+P) for now, or include html2pdf.js library');
      window.print();
    }
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      {/* Control Panel */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => setIsEditing(!isEditing)} style={buttonStyle}>
          {isEditing ? <Eye size={18} /> : <Edit2 size={18} />}
          <span>{isEditing ? 'Preview' : 'Edit'}</span>
        </button>
        <button onClick={downloadAsPDF} style={buttonStyle}>
          <Download size={18} />
          <span>Download PDF</span>
        </button>
        <button onClick={printDocument} style={buttonStyle}>
          <FileText size={18} />
          <span>Print</span>
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div style={formContainerStyle}>
          <h2 style={{ marginBottom: '20px', color: '#1e3a8a' }}>Edit Letter Content</h2>
          
          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Reference Number</label>
              <input name="reference" value={formData.reference} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Date</label>
              <input name="date" value={formData.date} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Salutation</label>
              <input name="salutation" value={formData.salutation} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Employee Name</label>
              <input name="employeeName" value={formData.employeeName} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Job Title</label>
              <input name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Start Date</label>
              <input name="startDate" value={formData.startDate} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>End Date</label>
              <input name="endDate" value={formData.endDate} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Paragraph 1</label>
              <textarea name="paragraph1" value={formData.paragraph1} onChange={handleInputChange} style={textareaStyle} rows={3} />
            </div>

            <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Paragraph 2</label>
              <textarea name="paragraph2" value={formData.paragraph2} onChange={handleInputChange} style={textareaStyle} rows={3} />
            </div>

            <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Paragraph 3</label>
              <textarea name="paragraph3" value={formData.paragraph3} onChange={handleInputChange} style={textareaStyle} rows={2} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Signer Name</label>
              <input name="signerName" value={formData.signerName} onChange={handleInputChange} style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Signer Title</label>
              <input name="signerTitle" value={formData.signerTitle} onChange={handleInputChange} style={inputStyle} />
            </div>
          </div>
        </div>
      )}

      {/* Letterhead Preview */}
      <div ref={letterheadRef} style={letterheadStyle} className="letterhead-print">
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerOverlay1}></div>
          <div style={headerOverlay2}></div>
          
          <div style={logoSectionStyle}>
            <div style={logoContainerStyle}>
              <span style={logoRedStyle}>SD</span>
              <span style={logoGreenStyle}>C</span>
            </div>
            <div>
              <div style={companyNameStyle}>SolutionDots Consultancy</div>
            </div>
          </div>
          
          <div style={taglineStyle}>Innovative Technology Solutions | Software Development & IT Services</div>
          
          <div style={contactBarStyle}>
            <div style={contactItemStyle}>📞 +92 42 35817086</div>
            <div style={contactItemStyle}>✉️ info@solutiondots.com</div>
            <div style={contactItemStyle}>🌐 www.solutiondots.com</div>
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <div style={referenceStyle}>{formData.reference}</div>
          <div style={dateStyle}>{formData.date}</div>

          <div style={letterBodyStyle}>
            <p style={salutationTextStyle}><strong>{formData.salutation}</strong></p>

            <p style={paragraphStyle}>
              This is to certify that <strong>{formData.employeeName}</strong> worked with SolutionDots Consultancy 
              as <strong>{formData.jobTitle}</strong> from <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong>.
            </p>

            <p style={paragraphStyle}>{formData.paragraph1}</p>
            <p style={paragraphStyle}>{formData.paragraph2}</p>
            <p style={paragraphStyle}>{formData.paragraph3}</p>

            <div style={{ marginTop: '50px' }}>
              <strong>Sincerely,</strong><br/><br/><br/>
              <div style={{ borderBottom: '1px solid #333', width: '200px', marginBottom: '5px' }}></div>
              <strong>{formData.signerName}</strong><br/>
              {formData.signerTitle}<br/>
              SolutionDots Consultancy
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <div style={footerContentStyle}>
            <div style={officeInfoStyle}>
              <div style={officeTitleStyle}>Head Office</div>
              <div style={officeAddressStyle}>
                  72 Main Boulevard Gulberg, Block H Gulberg 2<br/>
                Lahore, 54660, Pakistan<br/>
                Tel: +92 42 35817086
                
              </div>
            </div>
            <div style={footerRightStyle}>
              <a href="https://solutiondots.com" style={websiteStyle}>www.solutiondots.com</a>
              <div style={{ color: '#94a3b8', marginTop: '5px', fontSize: '11px' }}>
                Empowering businesses through technology
              </div>
              {/* <div style={socialLinksStyle}>
                <div style={socialIconStyle}>in</div>
                <div style={socialIconStyle}>𝕏</div>
                <div style={socialIconStyle}>f</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ maxWidth: '900px', margin: '20px auto', textAlign: 'center', color: '#666', fontSize: '13px' }}>
        <p><strong>Note:</strong> For best PDF results, install html2pdf.js library or use browser's Print to PDF (Ctrl+P / Cmd+P)</p>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>To add html2pdf.js, include: &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"&gt;&lt;/script&gt;</p>
      </div>

      <style>{`
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .letterhead-print, .letterhead-print * {
            visibility: visible;
          }
          .letterhead-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: avoid;
            page-break-before: avoid;
            page-break-inside: avoid;
          }
          @page {
            margin: 0;
            size: A4;
          }
        }
        
        .letterhead-print {
          page-break-inside: avoid;
          page-break-before: auto;
          page-break-after: auto;
        }
      `}</style>
    </div>
  );
};

// Styles
const buttonStyle = {
  background: '#4a5568',
  // ... rest stays same
};

const formContainerStyle = {
  maxWidth: '900px',
  margin: '0 auto 30px',
  background: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  color: '#2d3748',
  // ... rest stays same
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border 0.2s'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit'
};

const letterheadStyle = {
  width: '210mm',
  minHeight: '287mm',  // Changed from '297mm' to give 10mm breathing room
  height: 'auto',
  background: 'white',
  margin: '0 auto',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
};

const headerStyle = {
  backgroundColor: '#ffffff',
  background: '#ffffff',
  padding: '40px 60px',  // Changed from '35px 50px'
  color: '#2d3748',
  position: 'relative',
  overflow: 'hidden',
  flexShrink: 0,
  borderBottom: '2px solid #e2e8f0',
  WebkitPrintColorAdjust: 'exact',
  printColorAdjust: 'exact'
};

const headerOverlay1 = {
  content: '',
  position: 'absolute',
  top: '-50%',
  right: '-10%',
  width: '400px',
  height: '400px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '50%'
};

const headerOverlay2 = {
  content: '',
  position: 'absolute',
  bottom: '-30%',
  left: '-5%',
  width: '300px',
  height: '300px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '50%'
};

const logoSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '18px',
  position: 'relative',
  zIndex: 1
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '42px',
  letterSpacing: '-2px',
  fontFamily: 'Arial, sans-serif',
  WebkitPrintColorAdjust: 'exact',
  printColorAdjust: 'exact'
};

const logoRedStyle = {
  color: '#2d3748',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
};

const logoGreenStyle = {
  color: '#4a5568',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
};

const companyNameStyle = {
  fontSize: '28px',
  fontWeight: '700',
  letterSpacing: '-0.5px',
  marginTop: '-5px',
  color: '#2d3748'
};

const taglineStyle = {
  fontSize: '14px',
  opacity: 0.7,
  fontWeight: '300',
  position: 'relative',
  zIndex: 1,
  color: '#4a5568'
};

const contactBarStyle = {
  display: 'flex',
  gap: '30px',
  fontSize: '11px',
  marginTop: '18px',
  opacity: 0.95,
  position: 'relative',
  zIndex: 1,
  flexWrap: 'wrap'
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const contentStyle = {
  padding: '50px 60px',  // Changed from '45px 50px'
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
};

const referenceStyle = {
  fontSize: '12px',
  color: '#666',
  marginBottom: '10px'
};

const dateStyle = {
  fontSize: '12px',
  color: '#666',
  marginBottom: '35px'
};

const letterBodyStyle = {
  lineHeight: 1.8,
  color: '#333',
  fontSize: '14px',
  flex: 1
};

const salutationTextStyle = {
  fontWeight: '600',
  marginBottom: '20px'
};

const paragraphStyle = {
  marginBottom: '18px'
};

const footerStyle = {
  background: '#f8fafc',
  padding: '30px 60px',  // Changed from '25px 50px'
  borderTop: '2px solid #cbd5e1',
  flexShrink: 0,
  marginTop: 'auto',
  WebkitPrintColorAdjust: 'exact',
  printColorAdjust: 'exact'
};

const footerContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  fontSize: '11px',
  color: '#64748b'
};

const officeInfoStyle = {
  flex: 1
};

const officeTitleStyle = {
  color: '#2d3748',
  // ... rest stays same
};

const officeAddressStyle = {
  lineHeight: 1.6
};

const footerRightStyle = {
  textAlign: 'right'
};

const websiteStyle = {
  color: '#2d3748',
  // ... rest stays same
};

const socialLinksStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  marginTop: '10px'
};

const socialIconStyle = {
  background: '#4a5568',
  // ... rest stays same
};

export default LetterheadGenerator;