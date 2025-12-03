import React from 'react';
import { Link } from 'react-router-dom';
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from 'react-icons/bs';
import { Separator } from '@/components/ui/separator';

const FooterCom = () => {
  return (
    <footer className="border-t bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mb-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded-lg">
                Bangboy's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">About</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://www.w3schools.com/js/default.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    100 JS Projects
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Bangboy's Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">Follow us</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://www.w3schools.com/js/default.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="/3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">Legal</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://www.w3schools.com/js/default.asp"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{' '}
            <a href="3" className="hover:underline">
              Bangboy's blog
            </a>
            . All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <BsFacebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <BsInstagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <BsTwitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <BsGithub className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dribbble"
            >
              <BsDribbble className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCom;
