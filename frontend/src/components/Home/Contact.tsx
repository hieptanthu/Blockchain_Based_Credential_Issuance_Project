// src/components/ContactForm.jsx
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t } = useTranslation();

  return (
    <div className="  px-6 py-1.5">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("contact.title")}
        </h2>
        <p className="mt-2 text-lg">{t("contact.description")}</p>
      </div>

      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold">
              {t("contact.first_name")}
            </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              autoComplete="given-name"
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 shadow-sm focus:outline-indigo-600"
            />
          </div>

          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold">
              {t("contact.last_name")}
            </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              autoComplete="family-name"
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 shadow-sm focus:outline-indigo-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="company" className="block text-sm font-semibold">
              {t("contact.company")}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              autoComplete="organization"
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 shadow-sm focus:outline-indigo-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold">
              {t("contact.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 shadow-sm focus:outline-indigo-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-semibold">
              {t("contact.phone_number")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 shadow-sm focus:outline-indigo-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold">
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              name="message"
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2 shadow-sm focus:outline-indigo-600"
            ></textarea>
          </div>

          <div className="flex items-center sm:col-span-2">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              className="h-4 w-4 text-indigo-600"
            />
            <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
              {t("contact.agree_text")}{" "}
              <a href="#" className="font-semibold text-indigo-600">
                {t("contact.privacy_policy")}
              </a>
              .
            </label>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-white font-semibold hover:bg-indigo-500 focus:outline-indigo-600"
          >
            {t("contact.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
