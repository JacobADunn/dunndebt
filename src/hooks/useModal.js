import {useState} from "react";

export default function useModal(initial=false){
  const [isOpen,setIsOpen]=useState(initial);
  return {
    isOpen,
    open:()=>setIsOpen(true),
    close:()=>setIsOpen(false),
    toggle:()=>setIsOpen(v=>!v)
  };
}
