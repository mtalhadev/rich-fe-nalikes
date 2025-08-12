import EmailIcon from "@/icons/email.icon";
import Image from "next/image";
import { useState } from "react";

export default function NewsLetterSection() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };
  return (
    <div className="w-full pb-8 md:pb-10 lg:pb-8 relative overflow-hidden mt-8 md:mt-10">
      <div className="px-4 md:px-10 lg:px-20 xl:px-28 relative z-10">
        <h2 className="hidden md:block md:text-[16px] lg:text-[18px] xl:text-[20px] font-nunito-sans mb-3 md:mb-4 lg:mb-3 text-[#018EFC]">
          The ocean's empty without you
        </h2>
        <p className="uppercase text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center md:text-left md:pr-40 md:mt-4 font-nunito-sans font-black mb-8 md:mb-12 lg:mb-8 leading-tight text-navy/90">
          Join for daily memes, updates, and occasional world domination plans.
        </p>

        <form
          onSubmit={handleNewsletterSubmit}
          className="flex flex-col lg:flex-row lg:items-center items-start gap-4 md:gap-6 w-full"
        >
          <div className="h-14 md:h-12 lg:h-14 bg-[#B8CEFF] w-full md:w-[50%] text-gray-500 rounded-xl md:rounded-2xl overflow-hidden flex items-center gap-3 md:gap-4 relative">
            <EmailIcon className="absolute left-3 md:left-4 lg:left-5 w-6 h-6" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full h-full font-raleway outline-none p-2 md:p-4 px-10 md:px-12 lg:px-14 xl:px-16 text-sm md:text-base lg:text-lg xl:text-xl bg-transparent"
              required
            />
            <button
              type="submit"
              className="md:hidden mr-2 bg-[#018EFC] w-fit h-10 px-4 lg:px-16 text-sm text-white flex items-center justify-center rounded-xl md:rounded-2xl font-poppins font-bold font-raleway cursor-pointer transition-colors hover:bg-[#0066CC]"
            >
              Subscribe
            </button>
          </div>
          <button
            type="submit"
            className="hidden md:flex bg-[#018EFC] w-full md:w-fit h-10 md:h-12 lg:h-14 px-8 md:px-12 lg:px-16 text-sm md:text-base lg:text-lg xl:text-xl text-white items-center justify-center rounded-xl md:rounded-2xl font-poppins font-bold font-raleway cursor-pointer transition-colors hover:bg-[#0066CC]"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Background decoration */}
    </div>
  );
}
