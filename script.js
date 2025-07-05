window.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.getElementById("current-date");
  const today = new Date();

  const formatted = today.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  dateEl.textContent = formatted;
});

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const element = document.getElementById("pdf-content");

  // Hide the button in PDF
  document.querySelector(".no-print").style.display = "none";

  const canvas = await html2canvas(element, {
    scale: 2,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;
  let heightLeft = imgHeight;

  // Split into multiple pages
  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    if (heightLeft > 0) {
      pdf.addPage();
      position = position - pageHeight;
    }
  }

  pdf.save("werkplekinspectie.pdf");

  // Restore button
  document.querySelector(".no-print").style.display = "block";
}
