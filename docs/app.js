// Flame Division Partner Program — Affiliate Landing
// TTS overview, terms narration, smooth scroll, and simple client-side form handling.

(function () {
  const ttsState = {
    synth: "speechSynthesis" in window ? window.speechSynthesis : null,
    supported:
      "speechSynthesis" in window &&
      typeof window.SpeechSynthesisUtterance !== "undefined",
    current: null,
  };

  function stopSpeaking() {
    if (ttsState.synth && ttsState.synth.speaking) {
      ttsState.synth.cancel();
      ttsState.current = null;
    }
  }

  function speak(text) {
    if (!ttsState.supported || !text) return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      ttsState.current = null;
    };

    ttsState.current = utterance;
    ttsState.synth.speak(utterance);
  }

  // Preload voices for Safari / iOS quirks
  if (ttsState.synth) {
    try {
      ttsState.synth.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        ttsState.synth.getVoices();
      };
    } catch (e) {
      console.warn("TTS voice preload issue:", e);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const overviewBtn = document.getElementById("btn-tts-overview");
    const termsBtn = document.getElementById("btn-tts-terms");
    const formSection = document.getElementById("partner-form-section");
    const scrollBtn = document.getElementById("scroll-to-form");
    const form = document.getElementById("partner-form");
    const messageEl = document.getElementById("form-message");
    const summaryEl = document.getElementById("application-summary");

    // Smooth scroll
    if (scrollBtn && formSection) {
      scrollBtn.addEventListener("click", () => {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // Overview narration
    if (overviewBtn) {
      overviewBtn.addEventListener("click", () => {
        if (!ttsState.supported) {
          alert(
            "Text-to-speech is not available in this browser. Try Chrome, Edge, or Safari."
          );
          return;
        }

        const script =
          "Welcome to the Flame Division Partner Program. " +
          "This is an operator grade affiliate lane, not a hype funnel. " +
          "Your job is simple: share a verified referral link, route people " +
          "into official Academy pages, and let Flame Division handle instruction, " +
          "certification, and governance. You are a referrer, not a representative. " +
          "If that sounds like your lane, scroll down and request partner access.";

        speak(script);
      });
    }

    // Terms narration
    if (termsBtn) {
      termsBtn.addEventListener("click", () => {
        if (!ttsState.supported) {
          alert(
            "Text-to-speech is not available in this browser. Try Chrome, Edge, or Safari."
          );
          return;
        }

        const script =
          "Key partner terms. One: you do not teach or coach on behalf of Flame Division. " +
          "Two: you never promise guaranteed outcomes or specific earnings. " +
          "Three: you send people to official pages only and stay within the written message. " +
          "Four: payouts are only made on cleared enrollments after refunds and charge windows. " +
          "If you can respect those guardrails, you are exactly the kind of operator we want.";
        speak(script);
      });
    }

    // Form handling
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        messageEl.textContent = "";
        messageEl.className = "form-message";

        const data = {
          fullName: form.fullName.value.trim(),
          email: form.email.value.trim(),
          handle: form.handle.value.trim(),
          audience: form.audience.value.trim(),
          alignment: form.alignment.value.trim(),
          reach: form.reach.value.trim(),
          stripeEmail: form.stripeEmail.value.trim(),
          country: form.country.value.trim(),
          agree: document.getElementById("agree").checked,
        };

        // Basic validation
        if (
          !data.fullName ||
          !data.email ||
          !data.handle ||
          !data.audience ||
          !data.alignment ||
          !data.stripeEmail ||
          !data.agree
        ) {
          messageEl.textContent =
            "Please complete all required fields and confirm the partner agreement.";
          messageEl.classList.add("error");
          return;
        }

        // Generate payload summary for manual processing
        const payloadLines = [
          "Flame Division Partner Request",
          "----------------------------------",
          `Full name: ${data.fullName}`,
          `Email: ${data.email}`,
          `Preferred referral handle: ${data.handle}`,
          `Where I would share Flame Division:`,
          data.audience,
          "",
          "Why I align with Flame Division values:",
          data.alignment,
          "",
          data.reach ? `Estimated monthly reach: ${data.reach}` : "",
          data.country ? `Country / Time zone: ${data.country}` : "",
          "",
          `Stripe payout email: ${data.stripeEmail}`,
          "",
          "I acknowledge that I am a referrer, not a representative or instructor.",
        ].filter(Boolean);

        if (summaryEl) {
          summaryEl.textContent = payloadLines.join("\n");
        }

        // In production, hook this into your backend, email service, or referral platform.
        messageEl.textContent =
          "Request captured locally. Copy the payload below and send it to the Flame Division review channel or connect this form to your backend when ready.";
        messageEl.classList.add("success");

        // Optional: clear main fields but keep summary
        // form.reset();
      });
    }
  });
})();
