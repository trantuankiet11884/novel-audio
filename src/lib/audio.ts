import CryptoJS from "crypto-js";
import { decode } from "html-entities";
import sanitizeHtml from "sanitize-html";
import axios from "axios";

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

export function splitText(text: string): string[] {
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
