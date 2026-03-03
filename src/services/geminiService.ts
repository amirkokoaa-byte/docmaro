import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAiClient() {
  if (ai) return ai;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("مفتاح API مفقود. يرجى إضافة GEMINI_API_KEY في إعدادات البيئة (Environment Variables) على Vercel.");
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
}

export type AnalysisType = 'prescription' | 'scan' | 'lab-report';

const PROMPTS = {
  prescription: `
    قم بتحليل هذه الوصفة الطبية (الروشتة) بدقة عالية.
    1. استخرج أسماء الأدوية المكتوبة (الاسم العلمي والتجاري إن وجد).
    2. وضح الجرعة المكتوبة لكل دواء.
    3. اشرح بالتفصيل استخدام كل دواء ولماذا يوصف عادة.
    4. قدم أي نصائح إضافية تتعلق بتناول هذه الأدوية.
    
    الرجاء تنسيق الإجابة بشكل منظم وواضح باللغة العربية.
  `,
  scan: `
    قم بتحليل هذه الصورة الطبية (أشعة سينية، رنين مغناطيسي، مقطعية، إلخ).
    1. حدد نوع الأشعة والجزء المصور من الجسم.
    2. صف ما تراه في الصورة بدقة.
    3. هل توجد أي ملاحظات غير طبيعية أو كسور أو أورام أو التهابات ظاهرة؟
    4. اشرح النتائج بلغة طبية مبسطة ومفهومة.
    
    الرجاء تنسيق الإجابة بشكل منظم وواضح باللغة العربية.
  `,
  'lab-report': `
    قم بتحليل تقرير التحليل الطبي هذا.
    1. استخرج أسماء الفحوصات والنتائج والقيم الطبيعية (Reference Ranges).
    2. حدد القيم غير الطبيعية (المرتفعة أو المنخفضة) واشرح دلالتها.
    3. بناءً على النتائج، هل هناك مؤشرات لمرض معين (مثل فقر الدم، السكري، مشاكل الكبد، إلخ)؟
    4. اقترح فيتامينات أو مكملات غذائية أو تغييرات في نمط الحياة قد تكون مفيدة (مع التنبيه بضرورة استشارة الطبيب).
    
    الرجاء تنسيق الإجابة بشكل منظم وواضح باللغة العربية.
  `
};

export async function analyzeMedicalImage(file: File, type: AnalysisType): Promise<string> {
  try {
    const client = getAiClient();
    const base64Data = await fileToGenerativePart(file);
    
    const model = "gemini-2.5-flash"; // Using flash for speed and multimodal capabilities
    
    const prompt = PROMPTS[type];

    const response = await client.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: prompt }
        ]
      }
    });

    return response.text || "عذراً، لم أتمكن من تحليل الصورة. يرجى المحاولة مرة أخرى.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("حدث خطأ أثناء تحليل الصورة. تأكد من أن الصورة واضحة وحاول مرة أخرى.");
  }
}

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
