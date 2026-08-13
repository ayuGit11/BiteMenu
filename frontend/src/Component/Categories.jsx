import { TiThSmallOutline } from "react-icons/ti";
import { MdFreeBreakfast } from "react-icons/md";
import { TbSoupFilled } from "react-icons/tb";
import { GiNoodles } from "react-icons/gi";
import { MdDinnerDining } from "react-icons/md";
import { FaPizzaSlice } from "react-icons/fa";
import { GiHamburger } from "react-icons/gi";
export const Categories=[
    {
        id:1,
        name:"All",
        image:<TiThSmallOutline className='w-12 h-12  text-amber-900'/>
    },
     {
        id:2,
        name:"Breakfast",
        image:<MdFreeBreakfast className='w-12 h-12  text-amber-900'/>
    },
     {
        id:3,
        name:"Soups",
        image:<TbSoupFilled className='w-12 h-12  text-amber-900' />
    },
     {
        id:4,
        name:"Pasta",
        image:<GiNoodles className='w-12 h-12  text-amber-900'/>
    },
     {
        id:5,
        name:"Main_Course",
        image:<MdDinnerDining className='w-12 h-12  text-amber-900'/>
    },
     {
        id:6,
        name:"Pizza",
        image:<FaPizzaSlice className='w-12 h-12  text-amber-900'/>
     },
     {
        id:7,
        name:"Burger",
        image:<GiHamburger className='w-12 h-12 text-amber-900'/>
    }
]
export default Categories;