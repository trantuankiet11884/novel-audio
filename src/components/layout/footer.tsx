// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-700 px-4 py-6 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © 202 Audiobooks Novel Full Reader MTL Novel Audio . All Rights
            Reserved.
          </span>
          <div>
            <ul className=" flex justify-end flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
              <li className="m-2">
                <a
                  href="/privacy-policy"
                  className="mr-4 hover:underline md:mr-6"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="m-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.novelfull.audio.novel_app"
                  target="_blank"
                >
                  Android App
                </a>
              </li>
              <li className="m-2">
                <a
                  href="https://apps.apple.com/us/app/novelfull-audio/id6477849970"
                  target="_blank"
                >
                  iOS App
                </a>
              </li>
              <li className="m-2">
                <a
                  href="mailto:support@mtlnovel.audio"
                  target="_blank"
                  className="hover:underline"
                >
                  Contact: support@mtlnovel.audio
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
