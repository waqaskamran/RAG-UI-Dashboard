import React, { useState, useRef } from 'react';
import { Download, Edit2, Eye, FileText } from 'lucide-react';

const ConsultechLetterGenerator = () => {
    const [formData, setFormData] = useState({
        reference: 'CT/HR/2017/078',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        salutation: 'TO WHOM IT MAY CONCERN',
        employeeName: 'Rana Waqas Kamran',
        jobTitle: 'Software Engineer',
        startDate: 'August 1, 2016',
        endDate: 'July 12, 2017',
        paragraph1: 'In this capacity, he was primarily responsible for software development tasks, working on client projects and maintaining code quality. He participated in team meetings and contributed to project planning sessions.',
        paragraph2: 'He showed dedication and professionalism in his role, maintaining good work ethics and delivering quality results.',
        paragraph3: 'We appreciate his contributions and wish him success in his future career.',
        signerName: 'Muhammad Shahnawaz',
        signerTitle: 'Chief Executive Officer'
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
            filename: `Consultech_Experience_Letter_${Date.now()}.pdf`,
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
                    <h2 style={{ marginBottom: '20px', color: '#f97316' }}>Edit Letter Content</h2>

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
                            <textarea name="paragraph2" value={formData.paragraph2} onChange={handleInputChange} style={textareaStyle} rows={2} />
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

                    <div style={circularLogoStyle}>
  <div style={arcStyle}></div>
  <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '3px' }}>
    <div style={dotStyle}></div>
    <div style={dotStyle}></div>
    <div style={dotStyle}></div>
    <div style={dotStyle}></div>
  </div>
</div>
                    <div style={logoStyle}>
                        <span style={orangeLetterStyle}>C</span>
                        <span style={blackLetterStyle}>onsultech</span>
                    </div>
                    <div style={companyInfoStyle}>
                        119 Habitat, Jail Road, Lahore, 54660, Pakistan | Tel: 0423 8347654 | www.consultech.com
                    </div>
                    <div style={separatorLineStyle}></div>
                </div>

                {/* Reference and Date */}
                <div style={refDateStyle}>
                    <div style={refLineStyle}>Ref No: {formData.reference}</div>
                    <div style={dateLineStyle}>Date: {formData.date}</div>
                </div>

                {/* Document Title */}
                <div style={documentTitleStyle}>EXPERIENCE CERTIFICATE</div>

                {/* Salutation */}
                <div style={salutationStyle}>{formData.salutation}</div>

                {/* Body Content */}
                <div style={bodyContentStyle}>
                    <p style={paragraphStyle}>
                        This letter confirms the employment of <strong>{formData.employeeName}</strong>, who held the position
                        of <strong>{formData.jobTitle}</strong> with Consultech from <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong>.
                    </p>

                    <p style={paragraphStyle}>{formData.paragraph1}</p>
                    <p style={paragraphStyle}>{formData.paragraph2}</p>
                    <p style={paragraphStyle}>{formData.paragraph3}</p>
                </div>

                {/* Signature Section */}
                <div style={signatureSectionStyle}>
                    <div style={sincerelyStyle}>Sincerely,</div>
                    <div style={signatureSpaceStyle}></div>
                    <div style={signatureLineStyle}></div>
                    <div style={signerNameStyle}>{formData.signerName}</div>
                    <div style={signerTitleStyle}>{formData.signerTitle}</div>
                    <div style={companyNameBottomStyle}>Consultech</div>
                </div>

                {/* Footer */}
                <div style={footerStyle}>
                    <div style={footerLineStyle}></div>
                    <div style={footerTextStyle}>
                        Consultech | 119 Habitat, Jail Road, Lahore | Tel: 0423 8347654 | Email: info@consultech.com
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
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
    fontSize: '13px',
    fontWeight: '600',
    color: '#f97316',
    marginBottom: '6px'
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
    minHeight: '287mm',
    height: 'auto',
    background: 'white',
    margin: '0 auto',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '50px 60px'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
};

const logoStyle = {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    letterSpacing: '0.5px'
};

const orangeLetterStyle = {
    color: '#f97316',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact'
};

const blackLetterStyle = {
    color: '#1a1a1a'
};

const companyInfoStyle = {
    fontSize: '11px',
    color: '#666',
    marginBottom: '15px'
};

const separatorLineStyle = {
    height: '2px',
    background: '#e5e7eb',
    margin: '0 auto',
    width: '100%'
};

const refDateStyle = {
    textAlign: 'right',
    fontSize: '12px',
    color: '#4b5563',
    marginBottom: '30px'
};

const refLineStyle = {
    marginBottom: '5px',
    fontWeight: '500'
};

const dateLineStyle = {
    fontWeight: '500'
};

const documentTitleStyle = {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '25px',
    letterSpacing: '2px',
    textDecoration: 'underline',
    textDecorationColor: '#f97316',
    textDecorationThickness: '2px',
    textUnderlineOffset: '5px'
};

const salutationStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '20px'
};

const bodyContentStyle = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#1f2937',
    textAlign: 'justify',
    marginBottom: '40px'
};

const paragraphStyle = {
    marginBottom: '16px'
};

const signatureSectionStyle = {
    marginTop: '50px',
    marginBottom: '50px'
};

const sincerelyStyle = {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '60px'
};

const signatureSpaceStyle = {
    height: '40px'
};

const signatureLineStyle = {
    width: '220px',
    borderTop: '2px solid #1a1a1a',
    marginBottom: '8px'
};

const signerNameStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '4px'
};

const signerTitleStyle = {
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '4px'
};

const companyNameBottomStyle = {
    fontSize: '13px',
    color: '#4b5563',
    fontWeight: '600'
};

const footerStyle = {
    marginTop: 'auto',
    paddingTop: '20px'
};

const footerLineStyle = {
    height: '1px',
    background: '#d1d5db',
    marginBottom: '15px'
};

const footerTextStyle = {
    textAlign: 'center',
    fontSize: '10px',
    color: '#9ca3af'
};

// Add this style for the circular logo container
// Circular logo with broken arc and dots
const circularLogoStyle = {
    width: '50px',
    height: '50px',
    position: 'relative',
    margin: '0 auto 15px'
};

const arcStyle = {
  width: '50px',
  height: '50px',
  border: '4px solid #f97316',
  borderRadius: '50%',
  borderRightColor: 'transparent',  // Break on the RIGHT side
  transform: 'rotate(0deg)',  // No rotation needed
  position: 'absolute',
  WebkitPrintColorAdjust: 'exact',
  printColorAdjust: 'exact'
};

const dotsContainerStyle = {
  position: 'absolute',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '-5px'  // Position dots outside the circle
};

const dotStyle = {
    width: '4px',
    height: '4px',
    background: '#f97316',
    borderRadius: '50%',
    margin: '0 1px',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact'
};

export default ConsultechLetterGenerator;