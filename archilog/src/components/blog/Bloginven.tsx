import React from "react";
import Edit_W from "../../../public/images/edit_W.svg";
import Edit_B from "../../../public/images/edit_B.svg";
import Search from "../../../public/images/search.svg";
import Image from "next/image";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useRouter } from "next/router";

const Blog: React.FC = () => {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const currentUrl = router.asPath;
  const postLink = `${currentUrl}/post`;


  return (
    <div className="dark:text-white pt-16 dark:bg-black">
      {/* 검색창 */}

      <div className="flex items-center mx-auto mt-7 w-full max-w-3xl px-4">
        <div className="font-bold text-[25px]">Posts</div>
        <Image
          onClick={() => router.push(postLink)}
          src={darkMode ? Edit_W : Edit_B}
          alt="edit"
          className="ml-5 cursor-pointer w-[25px] h-[25px] transition-transform duration-300 hover:scale-110"
        />
        <div className="ml-auto bg-gray-200 dark:bg-white rounded-full h-[40px] p-4 dark:text-black flex items-center justify-center focus-within:border-blue-500 border-2">
          <input
            type="text"
            className="bg-gray-200 dark:bg-white dark:text-black outline-none "
          />
          <Image src={Search} alt="search" className="w-[20px] h-[20px] ml-2" />
        </div>
      </div>

      {/* 태그 */}

      <div className="flex items-center justify-center text-white dark:text-black font-bold text-[15px] mt-7 w-full max-w-3xl mx-auto flex-wrap border-b-black dark:border-b-white border-b-2 pb-7 ">
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover ">
          #JavaScript
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #TypeScript
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #React
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Vue
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #AWS
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Front-End
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Blog
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Ruby
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Design
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Book
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Etc
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Analytics
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Jekyll
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Analytics
        </div>
        <div className="bg-blue-500 dark:bg-headerDarkHover mx-1 my-1 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400 dark:hover:bg-tagDarkHover">
          #Jekyll
        </div>
      </div>

      {/* 게시글 768px 이상*/}

      <div className="flex flex-col items-center mx-auto my-8 max-w-3xl font-bold">
        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full items-center px-4 mb-7 hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out group">
          <Image
            className="w-[230px] h-[150px] sm:w-[230px] sm:h-[150px] lg:w-[230px] lg:h-[150px]"
            src="/images/Example.png"
            alt="Example"
            width={500}
            height={300}
          />
          <div className="ml-5">
            <div className="text-[20px] mt-5 overflow-hidden text-ellipsis max-w-[700px] line-clamp-2">
              Tick one more destination off of your bucket list with one of our
              most popular vacations in 2022. This vacation will make
              unforgettable memories and allow you to explore beautiful places.
            </div>
            <div className="font-light text-[14px] text-dateColor py-5 mb-3 group-hover:text-black dark:group-hover:text-white">
              21 March 2021
            </div>
          </div>
        </div>

        {/* 반응형 게시글 768px 이하*/}
        <div className="md:hidden flex flex-col items-center mx-auto mt-4">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col items-center mx-auto my-8">
          <div className="items-center px-4 w-[450px] hover:text-blue-500 dark:hover:text-headerDarkHover cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out group">
            <Image
              className="w-[450px] h-[250px]"
              src="/images/Example.png"
              alt="Example"
              width={500}
              height={300}
            />
            <div className="ml-5">
              <div
                className="font-regular text-[20px] mt-5 overflow-hidden
              max-w-[450px] line-clamp-2"
              >
                Tick one more destination off of your bucket list with one of
                our most popular vacations in 2022. This vacation will make
                unforgettable memories and allow you to explore beautiful
                places.
              </div>
              <div className="font-light text-[14px] text-dateColor py-5 group-hover:text-black dark:group-hover:text-white">
                21 March 2021
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
