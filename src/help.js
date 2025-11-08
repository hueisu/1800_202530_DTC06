document.addEventListener("DOMContentLoaded", function () {
  const faqButton = document.getElementById("faq-login");
  if (faqButton) {
    faqButton.addEventListener("click", function () {
      const answerID = "faq-login-answer";
      const answer = document.getElementById(answerID);
      answer.classList.toggle("hidden");
      console.log(111);
    });
  }
});
