import re
import google.generativeai as genai
import os

# Configure API key (ensure you set this in your environment variables)
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
genai.configure(api_key=GENAI_API_KEY)

def evaluate_response(topic: str, question: str, answer: str, follow_up_required: bool, previous_rating: int = None):
    """Evaluates a candidate's response and provides detailed feedback."""
    prompt = (f"Evaluate the following answer based on relevance, fumbling, and grammar:\n\n"
              f"==============================\n"
              f"Topic: {topic}\n"
              f"Question: {question}\n"
              f"Answer: {answer}\n"
              f"Follow-up required: {follow_up_required}\n"
              f"==============================\n\n"
              f"Provide:\n"
              f"- Relevance rating (out of 10)\n"
              f"- Fumble rating (out of 10)\n"
              f"- Grammatical mistake rating (out of 10)\n"
              f"- If needed, mention the total number of occurrences of hesitation, repetition, or errors.\n"
              f"- Generate two automatic follow-up questions if necessary.\n"
              f"- Provide an overall rating based on the answer quality (mention it clearly as 'Overall rating: X').\n"
              f"- Suggest specific improvements based on the weaknesses in the answer.\n")
    
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    feedback = response.text
    
    # Extract follow-up questions (if any)
    follow_up_question_prompt = (f"Based on the given answer, suggest two relevant follow-up questions.\n\n"
                                 f"Question: {question}\nAnswer: {answer}\n\n"
                                 f"Provide the questions in a clear format.")
    follow_up_response = model.generate_content(follow_up_question_prompt)
    follow_up_questions = follow_up_response.text.strip()
    
    # Extract overall rating using regex
    overall_rating_match = re.search(r'Overall rating:\s*(\d+)', feedback)
    overall_rating = int(overall_rating_match.group(1)) if overall_rating_match else None

    # Extract improvement suggestions
    improvement_prompt = (f"Based on the provided evaluation, give specific improvement tips for the user.\n\n"
                          f"Answer: {answer}\n\n"
                          f"Evaluation Feedback: {feedback}\n\n"
                          f"Provide detailed areas of improvement.")
    improvement_response = model.generate_content(improvement_prompt)
    improvement_suggestions = improvement_response.text.strip()

    # Calculate Improvement if previous rating is given
    improvement_flag = improvement_suggestions if previous_rating is not None and overall_rating is not None else "N/A"
    
    return feedback, follow_up_questions, improvement_flag

# Example Usage
if __name__ == "__main__":
    topic = "Object-Oriented Programming"
    question = "What are the four pillars of OOP?"
    answer = "Umm... The four pillars are... uh... inheritance, abstraction, and... oh polymorphism? And encapsulation."
    follow_up_required = True
    previous_rating = 5  # Example previous rating
    
    feedback, follow_up_questions, improvement_flag = evaluate_response(topic, question, answer, follow_up_required, previous_rating)
    
    print("\n============= Evaluation Feedback =============")
    print(feedback)
    print("\n============= Follow-up Questions =============")
    print(follow_up_questions)
    print("\n============= Improvement Suggestions =============")
    print(improvement_flag)
