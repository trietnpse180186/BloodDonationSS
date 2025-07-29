const bloodRegister = [
  {
    id: "q1",
    text: "1. Have you ever donated blood before?",
    options: [
      { value: "q1c1", label: "Yes" },
      { value: "q1c2", label: "No" },
    ],
  },
  {
    id: "q2",
    text: "2. Do you currently have any medical conditions?",
    options: [
      {
        value: "q2c1",
        label: "Yes",
        hasInput: true,
        inputPlaceholder: "Enter your answer",
      },
      { value: "q2c2", label: "No" },
    ],
  },
  {
    id: "q3",
    text: "3. Have you ever had any of the following diseases: hepatitis B, C, HIV, psoriasis, prostate hypertrophy, anaphylactic shock, stroke, myocardial infarction, lupus erythematosus, epilepsy, cancer, asthma, or organ transplantation?",
    options: [
      { value: "q3c1", label: "Yes" },
      { value: "q3c2", label: "No" },
      {
        value: "q3c3",
        label: "Other disease",
        hasInput: true,
        inputPlaceholder: "Enter disease name",
      },
    ],
  },
  {
    id: "q4",
    text: "4. In the past 12 months, have you:",
    options: [
      {
        value: "q4c1",
        label:
          "Recovered from any of the following: malaria, syphilis, tuberculosis, meningitis, tetanus, or had surgery?",
      },
      { value: "q4c2", label: "Received blood or blood products?" },
      {
        value: "q4c3",
        label: "Received a vaccine?",
        hasInput: true,
        inputPlaceholder: "Enter vaccine type",
      },
      { value: "q4c4", label: "No" },
    ],
  },
  {
    id: "q5",
    text: "5. In the past 6 months, have you:",
    options: [
      {
        value: "q5c1",
        label:
          "Recovered from any of the following: typhoid, sepsis, snake bite, arterial/venous thrombosis, pancreatitis, osteomyelitis?",
      },
      { value: "q5c2", label: "Unexplained rapid weight loss?" },
      { value: "q5c3", label: "Persistent lymphadenopathy?" },
      {
        value: "q5c4",
        label:
          "Undergone invasive medical procedures (dental, acupuncture, microneedling, endoscopy, etc.)?",
      },
      {
        value: "q5c5",
        label: "Tattooed, pierced ears, nose, or other body parts?",
      },
      { value: "q5c6", label: "Used drugs?" },
      {
        value: "q5c7",
        label:
          "Had direct contact with blood or secretions of others, or been injured by a needle?",
      },
      {
        value: "q5c8",
        label: "Lived with someone with hepatitis B?",
      },
      {
        value: "q5c9",
        label:
          "Had sexual contact with someone with hepatitis B, C, HIV, syphilis, or at risk of these?",
      },
      { value: "q5c10", label: "Had sexual contact with the same sex?" },
      { value: "q5c11", label: "No" },
    ],
  },
  {
    id: "q6",
    text: "6. In the past month, have you:",
    options: [
      {
        value: "q6c1",
        label:
          "Fallen ill after having urinary tract infection, skin infection, bronchitis, pneumonia, measles, pertussis, mumps, dengue, dysentery, cholera, or rubella?",
      },
      {
        value: "q6c2",
        label:
          "Traveled to an area with endemic diseases (malaria, dengue, Zika, etc.)?",
      },
      { value: "q6c3", label: "No" },
    ],
  },
  {
    id: "q7",
    text: "7. In the past 14 days, have you:",
    options: [
      {
        value: "q7c1",
        label: "Had flu, cold, cough, headache, fever, or sore throat?",
      },
      { value: "q7c2", label: "No" },
      {
        value: "q7c3",
        label: "Other (specify)",
        hasInput: true,
        inputPlaceholder: "",
      },
    ],
  },
  {
    id: "q8",
    text: "8. In the past 7 days, have you:",
    options: [
      {
        value: "q8c1",
        label:
          "Taken antibiotics, anti-inflammatories, Aspirin, or Corticoids?",
      },
      { value: "q8c2", label: "No" },
      {
        value: "q8c3",
        label: "Other (specify)",
        hasInput: true,
        inputPlaceholder: "",
      },
    ],
  },
  {
    id: "q9",
    text: "9. For women only:",
    options: [
      {
        value: "q9c1",
        label:
          "Are you currently pregnant or nursing a child under 12 months old?",
      },
      {
        value: "q9c2",
        label:
          "Terminated a pregnancy in the past 12 months (miscarriage, abortion, ectopic pregnancy)?",
      },
      { value: "q9c3", label: "No" },
    ],
  },
];
export function getLabelByValue(questionId, value) {
  const question = bloodRegister.find((q) => q.id === questionId);
  if (!question) return "";
  const option = question.options.find((opt) => opt.value === value);
  return option ? option.label : "";
}
export function getQuestionTextById(questionId) {
  const question = bloodRegister.find((q) => q.id === questionId);
  return question ? question.text : "";
}
export default bloodRegister;
