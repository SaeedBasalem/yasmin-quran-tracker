import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * يلتقط عنصر HTML (تقرير الأسبوع) ويصدّره ملفَّ PDF بحجم A4.
 *
 * نلتقط العنصر كصورة عبر html2canvas ثم نضعها في jsPDF — هذا المسار يضمن
 * إظهار النص العربي (RTL) بشكل صحيح لأن المتصفح هو من يرسمه، بخلاف كتابة
 * النص العربي مباشرة في jsPDF (التي تتطلّب خطوطاً وتشكيلاً معقّداً).
 */
export async function exportElementToPdf(el: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const imgData = canvas.toDataURL('image/png')

  // تقسيم على عدّة صفحات إذا تجاوز التقرير ارتفاع الصفحة.
  let heightLeft = imgHeight
  let position = 0
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight
  while (heightLeft > 0) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}
