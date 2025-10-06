import { ModerationStatus, ModerationResult } from "../state/appStore";
import { getAnthropicChatResponse } from "./chat-service";

export type { ModerationResult, ModerationStatus };

/**
 * AI Moderation System
 * 
 * Uses Claude AI to automatically moderate all public content:
 * - Stack descriptions
 * - Comments
 * - User bios
 * - Posts/reviews
 * 
 * Checks for:
 * - Spam
 * - Offensive language
 * - Medical misinformation
 * - Dangerous supplement advice
 * - Inappropriate content
 */

interface ModerationCheckResult {
  isApproved: boolean;
  status: ModerationStatus;
  reason?: string;
  confidence: number;
}

const MODERATION_PROMPT = `You are a content moderator for a Bulgarian supplement tracking social network app. 

Analyze the following content and determine if it should be approved, rejected, or flagged.

Content to moderate:
---
{CONTENT}
---

Check for:
1. Spam or promotional content
2. Offensive, abusive, or discriminatory language
3. Medical misinformation or dangerous health advice
4. Dangerous supplement recommendations (e.g., excessive dosages)
5. Inappropriate or explicit content
6. Personal information sharing (emails, phone numbers, addresses)

Respond in JSON format:
{
  "approved": true/false,
  "status": "approved" | "rejected" | "flagged",
  "reason": "Brief reason if not approved (in Bulgarian)",
  "confidence": 0.0-1.0
}

- Use "approved" if content is safe and appropriate
- Use "rejected" if content clearly violates guidelines
- Use "flagged" if uncertain and needs human review
- Confidence should be your certainty (0.0 = very uncertain, 1.0 = very certain)`;

/**
 * Moderate text content using AI
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    // Skip moderation for very short content
    if (content.trim().length < 3) {
      return {
        status: "approved",
        timestamp: Date.now(),
        confidence: 1.0,
      };
    }

    const prompt = MODERATION_PROMPT.replace("{CONTENT}", content);
    
    const response = await getAnthropicChatResponse(prompt);
    const responseText = response.content;

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid moderation response format");
    }

    const result: ModerationCheckResult = JSON.parse(jsonMatch[0]);

    return {
      status: result.status,
      timestamp: Date.now(),
      reason: result.reason,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error("Moderation error:", error);
    
    // On error, flag for human review (fail-safe approach)
    return {
      status: "flagged",
      timestamp: Date.now(),
      reason: "Автоматична проверка се провали, изисква ръчна проверка",
      confidence: 0,
    };
  }
}

/**
 * Moderate stack content (name + description)
 */
export async function moderateStack(name: string, description?: string): Promise<ModerationResult> {
  const content = `Stack Name: ${name}\nDescription: ${description || "None"}`;
  return moderateContent(content);
}

/**
 * Moderate comment
 */
export async function moderateComment(comment: string): Promise<ModerationResult> {
  return moderateContent(comment);
}

/**
 * Moderate user bio
 */
export async function moderateBio(bio: string): Promise<ModerationResult> {
  return moderateContent(bio);
}

/**
 * Check if content is approved and can be shown
 */
export function isContentApproved(moderation?: ModerationResult): boolean {
  if (!moderation) return true; // No moderation = assume approved (for old content)
  return moderation.status === "approved";
}

/**
 * Get moderation status display text
 */
export function getModerationStatusText(status: ModerationStatus): string {
  switch (status) {
    case "approved":
      return "Одобрено";
    case "pending":
      return "Изчаква проверка";
    case "rejected":
      return "Отхвърлено";
    case "flagged":
      return "Отбелязано за проверка";
    default:
      return "Неизвестен статус";
  }
}
