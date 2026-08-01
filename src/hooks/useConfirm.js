import {useState} from "react";

export default function useConfirm(){
  const [item,setItem]=useState(null);

  return {
    item,
    isOpen:item!==null,
    request:(value)=>setItem(value),
    cancel:()=>setItem(null),
    confirm:(callback)=>{
      if(item && callback) callback(item);
      setItem(null);
    }
  };
}
