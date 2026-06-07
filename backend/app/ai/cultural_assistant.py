import json
import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-pro"

KNOWLEDGE_BASE = """
Indian Handloom Knowledge Base:
- Kanjeevaram (Kanjivaram): A type of silk saree from Kanchipuram, Tamil Nadu. Known for thick silk threads, heavy gold zari borders. Pure zari is made from gold/silver. Takes 3-30 days to weave.
- Banarasi: Silk sarees from Varanasi, UP. Feature intricate gold/silver brocade, Mughal-inspired motifs like floral, kalga, bel. UNESCO heritage craft.
- Ikat (Ikkat): A dyeing technique using resist-dyeing on yarns before weaving. Pochampally (Telangana) and Sambalpuri (Odisha) are famous.
- Jamdani: Fine muslin with geometric/floral motifs woven in. Native to Bengal/Bangladesh. UNESCO intangible heritage. 
- Patola: Double ikat silk from Patan, Gujarat. Only 3 families make it. Price starts from ₹1 lakh.
- Kantha: Embroidered textile from Bengal using running stitch to create patterns.
- Phulkari: Embroidery from Punjab using silk floss on cotton. Motifs are geometric flowers.
- Chanderi: Lightweight fabric from Chanderi, MP. Blend of silk and cotton. Known for sheer texture.
- Maheshwari: From Maheshwar, MP. Has 5 stripes on border. Mix of silk and cotton.
- Zari: Metallic thread used in weaving, traditionally made from real gold/silver.
- Motifs: Lotus (purity), Peacock (grace, royalty), Elephant (strength), Mango/Paisley (fertility), Rudraksha (spirituality).
- Natural dyes: Indigo (blue), Turmeric (yellow), Pomegranate rind (gold), Madder root (red).
- GI Tags: Many Indian weaves have Geographical Indication tags protecting their authenticity.
"""

def answer_cultural_query(query: str, conversation_history: list, product_context: str = "") -> dict:
    """
    Answers cultural queries about Indian handlooms using RAG-style grounding.
    Returns dict with 'answer' and 'suggestions' (follow-up questions).
    """
    if not settings.GEMINI_API_KEY:
        return {
            "answer": f"I can tell you about Indian handloom traditions. Your question was: {query}. India has over 40 distinct weaving traditions, each with unique motifs and techniques passed down through generations.",
            "suggestions": ["What makes Kanjeevaram silk special?", "What is Ikat weaving?", "How are natural dyes made?"]
        }

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        history_text = ""
        if conversation_history:
            history_text = "\n".join([f"User: {h['user']}\nAssistant: {h['assistant']}" for h in conversation_history[-3:]])

        prompt = f"""
You are a knowledgeable and polite curator of Indian handloom heritage named "Weave Guide".
Answer the user's question using ONLY the provided knowledge base. Keep answers under 120 words.
If the answer is not in the knowledge base, say "I don't have that specific information, but I can tell you about [a related topic]."
Be culturally respectful and enthusiastic about the craft.

Knowledge Base:
{KNOWLEDGE_BASE}

Product Context (if user is viewing a specific product):
{product_context if product_context else "None"}

Recent Conversation:
{history_text if history_text else "None"}

User Question: {query}

Respond as JSON with keys:
1. "answer": Your response text.
2. "suggestions": Array of exactly 3 relevant follow-up questions the user might ask.

Return only valid JSON, no markdown formatting.
"""
        response = model.generate_content(prompt)
        response_text = response.text.strip().strip("```json").strip("```").strip()
        result = json.loads(response_text)
        return {
            "answer": result.get("answer", ""),
            "suggestions": result.get("suggestions", [])
        }
    except Exception as e:
        print(f"Cultural Assistant Error: {e}")
        return {
            "answer": "I apologize, I had trouble processing that. Please try asking about a specific weave like Kanjeevaram, Banarasi, or Ikat!",
            "suggestions": ["Tell me about Banarasi silk", "What are natural dyes?", "Which weaves have GI tags?"]
        }
