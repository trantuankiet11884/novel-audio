import axios from "axios";
import CryptoJS from "crypto-js";
import sanitizeHtml from "sanitize-html";

export async function getBase64Bin(
  text: string,
  voice: string
): Promise<string> {
  try {
    const response = await axios.post(
      "https://audio.novelfull.audio/audio",
      {
        sign: CryptoJS.AES.encrypt(
          JSON.stringify({ text, time: Date.now() / 1000, voice }),
          "uuidv4"
        ).toString(),
      },
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching audio:", error);
    return "";
  }
}

export async function getChapterText(
  novelId: string,
  chapterIndex: number,
  isGoogle: boolean = true
) {
  try {
    const options = {
      isgoogle: isGoogle,
      time: Date.now() / 1000,
      truyenId: novelId,
      index: chapterIndex,
    };
    const response = await axios.post(
      "https://api.novelfull.audio/book/text",
      {
        sign: CryptoJS.AES.encrypt(
          JSON.stringify(options),
          "uuidv4"
        ).toString(),
      },
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching chapter text:", error);
    return { err: "Failed to fetch text" };
  }
}

export function cleanText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function splitText(
  text: string,
  forSentences: boolean = false
): string[] {
  if (forSentences) {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s && s.length > 0);

    const result: string[] = [];
    let currentSentence = "";
    const MIN_SENTENCE_LENGTH = 30;

    for (const sentence of sentences) {
      if ((currentSentence + sentence).length < MIN_SENTENCE_LENGTH) {
        currentSentence += (currentSentence ? " " : "") + sentence;
      } else {
        if (currentSentence) {
          result.push(currentSentence);
        }
        if (sentence.length < MIN_SENTENCE_LENGTH) {
          currentSentence = sentence;
        } else {
          result.push(sentence);
          currentSentence = "";
        }
      }
    }

    if (currentSentence) {
      result.push(currentSentence);
    }

    return result;
  }

  const MAX_CHARS = 2000;
  const sentences = text
    .split(/\.|\?|:|!|-/)
    .filter((e) => e.trim() && e.trim().length > 0);
  let result: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHARS) {
      if (current) result.push(current.trim());
      current = sentence;
    } else {
      current += (current ? "." : "") + sentence;
    }
  }
  if (current) result.push(current.trim());

  return result.filter((e) => /[A-Za-z0-9]/.test(e));
}
