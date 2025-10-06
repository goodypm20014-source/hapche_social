/**
 * API service for supplement OCR backend
 * Connects to FastAPI server at 145.223.96.213:8000
 */

const API_BASE_URL = "http://145.223.96.213:8000";
const USE_MOCK_MODE = false; // Set to true for testing without backend

export interface OCRResponse {
  success: boolean;
  text: string;
  lines: string[];
}

export interface SupplementAnalysis {
  product_name: string;
  brand: string;
  ingredients: string[];
  serving_size: string;
  servings_per_container: number;
  warnings: string[];
  allergens: string[];
  description: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data: SupplementAnalysis;
}

/**
 * Mock data for testing
 */
const mockAnalysis: SupplementAnalysis = {
  product_name: "BCAA 2:1:1 Powder",
  brand: "Optimum Nutrition",
  ingredients: [
    "L-Leucine",
    "L-Isoleucine",
    "L-Valine",
    "Natural Flavors",
    "Citric Acid",
    "Sucralose"
  ],
  serving_size: "5g",
  servings_per_container: 60,
  warnings: ["Не превишавайте препоръчителната доза", "Консултирайте се с лекар при бременност"],
  allergens: ["Може да съдържа следи от мляко", "Произведено в съоръжение, което обработва соя"],
  description: "Хранителна добавка с разклонено-верижни аминокиселини в съотношение 2:1:1 за подпомагане на мускулното възстановяване след тренировка."
};

/**
 * Scan supplement label using OCR
 */
export async function scanSupplementLabel(imageUri: string): Promise<OCRResponse> {
  if (USE_MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      text: "BCAA 2:1:1 Powder\nOptimum Nutrition\nServing Size: 5g\nServings: 60",
      lines: ["BCAA 2:1:1 Powder", "Optimum Nutrition", "Serving Size: 5g", "Servings: 60"]
    };
  }

  try {
    const formData = new FormData();
    
    // Create file object from image URI
    const filename = imageUri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";
    
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OCR scan failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Scan error:", error);
    throw error;
  }
}

/**
 * Analyze OCR text using AI
 */
export async function analyzeSupplementText(text: string): Promise<AnalyzeResponse> {
  if (USE_MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      data: mockAnalysis
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
}

/**
 * Complete pipeline: scan + analyze
 */
export async function scanAndAnalyzeSupplement(imageUri: string): Promise<SupplementAnalysis> {
  if (USE_MOCK_MODE) {
    // Simulate full pipeline delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    return mockAnalysis;
  }

  const ocrResult = await scanSupplementLabel(imageUri);
  
  if (!ocrResult.success || !ocrResult.text) {
    throw new Error("OCR failed to extract text");
  }
  
  const analysisResult = await analyzeSupplementText(ocrResult.text);
  
  if (!analysisResult.success || !analysisResult.data) {
    throw new Error("AI analysis failed");
  }
  
  return analysisResult.data;
}
