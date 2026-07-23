import jsPDF from 'jspdf';
import type { AssembledCV } from '@/lib/api/cvs';

export function generateCvPdf(cv: AssembledCV) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const primaryColor = '#1e3a8a';
  const textColor = '#1f2937';
  const lightGray = '#f3f4f6';

  const addSectionHeading = (title: string) => {
    doc.setFillColor(lightGray);
    doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text(title.toUpperCase(), 22, y);
    y += 10;
    doc.setTextColor(textColor);
  };

  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');

  const firstNameAttr = cv.attributes.find(a => a.name === 'First Name');
  const lastNameAttr = cv.attributes.find(a => a.name === 'Last Name');
  const firstName = firstNameAttr?.value?.valueString ?? '';
  const lastName = lastNameAttr?.value?.valueString ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Your Name';

  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(fullName, 20, 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(cv.positionTitle, 20, 28);

  const locationAttr = cv.attributes.find(a => a.name === 'Location');
  const location = locationAttr?.value?.valueString ?? '';
  if (location) {
    doc.setFontSize(10);
    doc.text(`📍 ${location}`, 20, 40);
  }
  y = 50;

  const personalAttrs = cv.attributes.filter(a => a.name !== 'Personal Photo');
  if (personalAttrs.length > 0) {
    addSectionHeading('Personal Details');

    const col1X = 22;
    const col2X = pageWidth / 2 + 5;
    let col1Y = y;
    let col2Y = y;
    const lineHeight = 6;

    personalAttrs.forEach((attr, index) => {
      const x = index % 2 === 0 ? col1X : col2X;
      const currentY = index % 2 === 0 ? col1Y : col2Y;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${attr.name}:`, x, currentY);

      let value: string;
      if (!attr.value) {
        value = 'Not specified';
      } else if (attr.type === 'image') {
        value = '[Image attached]';
      } else if (attr.type === 'date') {
        value = new Date(attr.value.valueDate ?? attr.value).toLocaleDateString();
      } else {
        value = String(
          attr.value.valueString ??
          attr.value.valueNumeric ??
          attr.value.valueBoolean ??
          attr.value.valueOption ??
          attr.value.valueText ??
          attr.value.valueImageUrl ??
          ''
        ) || 'Not specified';
      }

      doc.setFont('helvetica', 'normal');
      doc.text(value, x + 30, currentY);

      if (index % 2 === 0) col1Y += lineHeight;
      else col2Y += lineHeight;
    });

    y = Math.max(col1Y, col2Y) + 10;
  }

  const otherAttrs = cv.attributes.filter(
    a => !a.name || !['First Name', 'Last Name', 'Location', 'Personal Photo'].includes(a.name)
  );
  if (otherAttrs.length > 0) {
    y += 5;
    addSectionHeading('Skills & Qualifications');

    otherAttrs.forEach((attr) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const label = `• ${attr.name}`;
      doc.text(label, 22, y);

      let value: string;
      if (!attr.value) {
        value = 'Not specified';
      } else if (attr.type === 'image') {
        value = '[Image]';
      } else if (attr.type === 'date') {
        value = new Date(attr.value.valueDate ?? attr.value).toLocaleDateString();
      } else {
        value = String(
          attr.value.valueString ??
          attr.value.valueNumeric ??
          attr.value.valueBoolean ??
          attr.value.valueOption ??
          attr.value.valueText ??
          attr.value.valueImageUrl ??
          ''
        ) || 'Not specified';
      }

      doc.setFont('helvetica', 'normal');
      doc.text(`: ${value}`, 22 + doc.getTextWidth(label), y);
      y += 6;
    });
    y += 5;
  }

  if (cv.projects.length > 0) {
    addSectionHeading('Projects');

    cv.projects.forEach((proj) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(proj.name, 22, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor('#6b7280');
      const period = `${new Date(proj.startDate).toLocaleDateString()} – ${proj.endDate ? new Date(proj.endDate).toLocaleDateString() : 'Present'}`;
      doc.text(period, 22, y);
      y += 5;

      if (proj.description) {
        doc.setTextColor(textColor);
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(proj.description, pageWidth - 44);
        lines.forEach((line: string) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 22, y);
          y += 5;
        });
      }
      y += 3;
    });
  }

  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  y = 280;
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  doc.setFontSize(8);
  doc.setTextColor('#9ca3af');
  doc.text('Generated by CV Matcha', pageWidth - 50, y + 5);
  doc.save(`CV_${fullName.replace(/\s+/g, '_') || 'My_CV'}.pdf`);
}
