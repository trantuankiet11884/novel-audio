const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 w-full mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Links & Navigation */}
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.novelfull.audio.novel_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Android App
                </a>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/us/app/novelfull-audio/id6477849970"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  iOS App
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@mtlnovel.audio"
                  className="hover:text-primary hover:underline transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>

          {/* Copyright Information */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © {currentYear} Audiobooks Novel Full Reader MTL Novel Audio. All
              Rights Reserved.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              <a
                href="mailto:support@mtlnovel.audio"
                className="hover:underline"
              >
                support@mtlnovel.audio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
