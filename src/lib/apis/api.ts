import axios from "axios";
const API_URL = "http://139.180.212.113:3007";

const API_PULIC = "https://api.novelfull.audio";

export interface Novel {
  _id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  thumb: string;
  name: string;
  genres: string[];
  status: string;
  rating: number;
  chapters: number;
  views: number;
  updatedAt: number | string;
  time?: number;
  ratingValue?: number;
  ratingCount?: number;
  web?: string;
}

export interface Chapter {
  _id?: string;
  title: string;
  slug: string;
}

export interface BookMark {
  meassage: {
    [key: string]: {
      _id: string;
      chapter: number;
      bookmark: boolean;
      read: boolean;
      time: number;
      chapters: number;
      name: string;
      status: string;
      thumb: string;
      slug: string;
    };
  };
}

export async function fetchNovels({
  sort = "views",
  keyword = "",
  limit = 20,
  genre,
  skip = 0,
  page = 1,
  chapters = "",
  status = "",
  author = "",
}: {
  sort?: string;
  limit?: number;
  genre?: string;
  skip?: number;
  page?: number;
  keyword?: string;
  chapters?: string;
  status?: string;
  author?: string;
}): Promise<{
  novels: Novel[];
  total: number;
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
}> {
  const API_URL = "http://139.180.212.113:3007";

  try {
    const response = await axios.post(
      `https://api.novelfull.audio/book/search`,
      {
        chapters,
        status,
        keyword,
        sort,
        limit,
        cats: genre ? [genre] : [],
        skip,
        author,
      }
    );
    const data = response.data;

    if (!Array.isArray(data.results)) {
      console.error("API returned invalid results:", data.results);
      return {
        novels: [],
        total: 0,
        page: 1,
        hasNext: false,
        hasPrev: false,
        totalPages: 0,
      };
    }

    const novels = data.results.map((novel: any) => ({
      _id: novel._id,
      slug: novel.slug,
      title: novel.name,
      name: novel.name,
      author: novel.author,
      description: novel.meta || "",
      cover: novel.cover,
      thumb: novel.thumb,
      genres: novel.cats?.length > 0 ? novel.cats : ["unknown"],
      status: novel.status || "unknown",
      rating: novel.review_score || 0,
      chapters: novel.chapters || 0,
      views: novel.views || 0,
      updatedAt: novel.time_new_chapter || novel.updatedAt || 0,
      time: novel.time,
      ratingValue: novel.ratingValue,
      ratingCount: novel.ratingCount,
      web: novel.web,
    }));

    const total = data.docs || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      novels,
      total,
      page,
      hasNext: skip + limit < total,
      hasPrev: page > 1,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching novels:", error);
    return {
      novels: [],
      total: 0,
      page: 1,
      hasNext: false,
      hasPrev: false,
      totalPages: 0,
    };
  }
}

export async function fetchTop10Novels(): Promise<{
  results: {
    name: string;
    truyens: Novel[];
  }[];
}> {
  const API_URL = "http://139.180.212.113:3007";

  try {
    const response = await axios.get(`${API_URL}/book/top10`);
    const data = response.data;

    if (!Array.isArray(data.results)) {
      console.error("API returned invalid results:", data.results);
      return { results: [] };
    }

    return {
      results: data.results,
    };
  } catch (error) {
    console.error("Error fetching novels:", error);
    return { results: [] };
  }
}

export async function fetchNovelBySlug(
  slug: string,
  source?: string
): Promise<{ novel: Novel | null; sources: string[] }> {
  const API_URL = "http://139.180.212.113:3007";

  try {
    const response = await axios.get(`${API_URL}/book/slug/${slug}`);
    const novels = response.data.results;

    if (!Array.isArray(novels) || novels.length === 0) {
      return { novel: null, sources: [] };
    }

    const sources = [...new Set(novels.map((n: any) => n.web).filter(Boolean))];

    let novel = source ? novels.find((n: any) => n.web === source) : novels[0];
    if (!novel) {
      novel = novels[0];
    }

    return {
      novel: {
        _id: novel._id,
        slug: novel.slug,
        title: novel.name,
        name: novel.name,
        author: novel.author,
        description: novel.meta || "",
        cover: novel.cover,
        thumb: novel.thumb,
        genres: novel.cats?.length > 0 ? novel.cats : ["unknown"],
        status: novel.status || "unknown",
        rating: novel.review_score || 0,
        chapters: novel.chapters || 0,
        views: novel.views || 0,
        updatedAt: novel.time_new_chapter || novel.updatedAt || 0,
        time: novel.time,
        ratingValue: novel.ratingValue,
        ratingCount: novel.ratingCount,
        web: novel.web,
      },
      sources,
    };
  } catch (error) {
    console.error("Error fetching novel by slug:", error);
    return { novel: null, sources: [] };
  }
}

export async function fetchChapters(novelId: string): Promise<Chapter[]> {
  try {
    const response = await axios.get(
      `http://45.77.253.44:3003/novel/chapters/${novelId}`
    );
    const data = response.data.result;

    if (!Array.isArray(data)) {
      console.error("Invalid chapters data:", data);
      return [];
    }

    return data.map(
      (ch: [string, string]): Chapter => ({
        title: ch[0],
        slug: ch[1],
      })
    );
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
}

export async function fetchGenres({
  skip = 0,
  limit = 20,
}: { skip?: number; limit?: number } = {}): Promise<{
  genres: string[];
  total: number;
}> {
  const API_URL = "http://139.180.212.113:3007";

  try {
    const response = await axios.get(`${API_URL}/auth/setting`);
    const data = response.data;

    if (!data.result || !Array.isArray(data.result.cats)) {
      console.error("API returned invalid genres data:", data);
      return { genres: [], total: 0 };
    }

    const allGenres = data.result.cats
      .map((cat: any) => cat.name)
      .filter((genre: string) => genre && genre !== "unknown");
    const uniqueGenres = [...new Set(allGenres)];

    const start = skip;
    const end = skip + limit;
    const paginatedGenres = uniqueGenres.slice(start, end);

    return {
      genres: paginatedGenres as string[],
      total: uniqueGenres.length,
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { genres: [], total: 0 };
  }
}

export const postBookMark = async (
  novelId: string,
  type = "bookmark",
  value = true
) => {
  const response = await axios.post(
    `https://api.novelfull.audio/user/web/bookmark`,
    {
      value,
      type,
      truyenId: novelId,
    }
  );
  return response.data;
};

export const getBookMark = async () => {
  const response: BookMark = await axios.get(
    `https://api.novelfull.audio/user/web/bookmark`
  );
  return response.meassage;
};
