document.addEventListener("DOMContentLoaded", function () {
  const faqButton = document.getElementById("faq-login");
  if (faqButton) {
    faqButton.addEventListener("click", function () {
      const answerID = "faq-login-answer";
      const answer = document.getElementById(answerID);
      answer.classList.toggle("hidden");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const faqButton = document.getElementById("faq-shopping-add");
  if (faqButton) {
    faqButton.addEventListener("click", function () {
      const answerID = "faq-shopping-add-answer";
      const answer = document.getElementById(answerID);
      answer.classList.toggle("hidden");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const faqButton = document.getElementById("faq-stores");
  if (faqButton) {
    faqButton.addEventListener("click", function () {
      const answerID = "faq-stores-answer";
      const answer = document.getElementById(answerID);
      answer.classList.toggle("hidden");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const faqButton = document.getElementById("faq-list");
  if (faqButton) {
    faqButton.addEventListener("click", function () {
      const answerID = "faq-list-answer";
      const answer = document.getElementById(answerID);
      answer.classList.toggle("hidden");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const faqButton = document.getElementById("faq-data");
  if (faqButton) {
    faqButton.addEventListener("click", function () {
      const answerID = "faq-data-answer";
      const answer = document.getElementById(answerID);
      answer.classList.toggle("hidden");
    });
  }
});
