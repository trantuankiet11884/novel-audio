interface Config {
  ads_max: number;
  title: string;
  author: string;
  headerTitle: string;
  description: string;
  language: string;
  site_name: string;
  apiv2: string;
  apiUrl: string;
  siteUrl: string;
  favIcon: string;
  twitterHandle: string;
  facebookPage: string;
  instagramHandle: string;
  organizationType: string;
  keywords: string[];
  page: {
    index: {
      header: string;
      title: string;
      subtitle: string;
    };
    blog: {
      header: string;
      title: string;
      subtitle: string;
    };
    tags: {
      header: string;
      title: string;
      subtitle: string;
    };
    project: {
      header: string;
      title: string;
      subtitle: string;
    };
  };
}

const config: Config = {
  ads_max: 5,
  title: "MTL Novel Audio",
  author: "MTL Novel Audio",
  headerTitle: "MTL Novel Audio",
  description:
    "Listen to high-quality audio versions of your favorite novels. MTL Novel Audio offers voice reading of all genres with immersive storytelling experience.",
  language: "en-EN",
  site_name: "mtlnovel.audio",
  twitterHandle: "@mtlnovelaudio",
  facebookPage: "https://facebook.com/mtlnovelaudio",
  instagramHandle: "https://instagram.com/mtlnovelaudio",
  organizationType: "WebSite",
  apiv2: "https://api.novelfull.audio",
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.novelfull.audio"
      : "http://localhost:3007",
  siteUrl:
    process.env.NODE_ENV === "production"
      ? "https://mtlnovel.audio"
      : "http://localhost:4000",
  favIcon: "/logos/logo.svg",
  keywords: ["novel", "audio", "novels", "audio novels", "novels audio"],
  page: {
    index: {
      header: "MTL Novel Audio",
      title:
        "Listen to your favorite novels in high-quality audio format - all genres available",
      subtitle:
        "Are you an avid reader like me? Let me help you have moments of relaxing listening to mp3 audio stories. Tell me the name of the series you like, you can listen to it all the time",
    },
    blog: {
      header: "Blog ✍️ - MTL Novel Audio",
      title: "Blog ✍️",
      subtitle:
        "I share anything that may help others, technologies I'm using and cool things I've made.",
    },
    tags: {
      header: "Tags 🏷️ - MTL Novel Audio",
      title: "Tags 🏷️",
      subtitle: "A specific categories to make your search easier",
    },
    project: {
      header: "Projects 📚 - MTL Novel Audio",
      title: "Projects 📚",
      subtitle: "A selection of projects I've worked on",
    },
  },
};

export default config;
