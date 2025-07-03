async function downloadPDF() {
  const { jsPDF } = window.jspdf;

  const button = document.querySelector(".no-print");
  button.style.display = "none";

  const element = document.getElementById("form-container");
  const canvas = await html2canvas(element, {
    scale: 2,
    ignoreElements: (el) => el.classList.contains("no-print"),
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
  } else {
    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      if (heightLeft > 0) {
        pdf.addPage();
        position = 0;
      }
    }
  }

  pdf.save("werkplekinspectie.pdf");
  button.style.display = "block";
}
