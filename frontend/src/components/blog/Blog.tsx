import Edit_W from "../../assets/images/edit_W.svg";
import Edit_B from "../../assets/images/edit_B.svg";
import Example from "../../assets/images/Example.png";
import { FC } from "react";

interface Blog{
    isDarkMode : boolean
}

const Blog:FC<Blog> = ({isDarkMode}) => {
    
  return (
    <div className="dark:text-white">
      <div className="flex items-center  mx-[480px] mt-5 ">
        <div className="font-bold text-[20px]">Posts</div>
        <img src={isDarkMode ? Edit_W : Edit_B} alt="edit" className="ml-5 cursor-pointer  "/>
        <input type="text" className="float-left bg-gray-300 rounded-full 
        ml-[650px] h-[40px] p-4 border-none dark:text-black" />
      </div>
      <div className="flex w-1/2 mx-[480px] my-8">
        <img className="w-[230px] h-[150px]" src={Example} alt="" />
        <div className="">
          <div className="font-[regular] text-[20px] w-[698px] h-[65px] mt-5 mx-5 overflow-hidden ">
          Tick one more destination off of your bucket list with one of our most popular vacations in 2022
          </div>
          <div className="font-light text-[14px] text-dateColor py-5 px-5">21 March 2021</div>
        </div>
      </div>


     

    </div>
  );
};

export default Blog;
