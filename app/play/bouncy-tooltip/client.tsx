"use client";

import React, { useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { createStore, StoreApi } from "zustand/vanilla"
import { AnimatePresence, motion } from "motion/react"
import { Tooltip, TooltipAnchor, TooltipProvider, useTooltipContext, Portal } from "@ariakit/react"
import Image from "next/image"

type CursorPositionStore = {
  pos: {x: number, y: number}
  updatePos: (x: number, y: number) => void
}
const CursorPositionStoreContext = React.createContext<StoreApi<CursorPositionStore>>(null!)
export const CursorPositionStoreProvider = ({ children }: {children: React.ReactNode}) => {
  const [store] = useState(() =>
    createStore<CursorPositionStore>((set, get) => ({
      pos: { x: 0, y: 0 },
      updatePos: (x: number, y: number) => {
        set({ pos: { x, y } })
      }
    }))
  );
  const updatePos = useStore(store, state => state.updatePos)

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      updatePos(e.clientX, e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return (() => {
      window.removeEventListener("mousemove", handleMouseMove)
    })
  }, [updatePos])

  return (
    <CursorPositionStoreContext.Provider value={store}>
      {children}
    </CursorPositionStoreContext.Provider>
  )
}

type CursorWithAttachedElementStore = {
  isHovering: boolean;
  setIsHovering: (newState: boolean) => void
}
const CursorWithAttachedElementStoreContext = React.createContext<StoreApi<CursorWithAttachedElementStore>>(null!)
const CursorWithAttachedElementStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [store] = useState(() =>
      createStore<CursorWithAttachedElementStore>((set, get) => ({
        isHovering: false,
        setIsHovering: (newState: boolean) => {
          set({ isHovering: newState })
        }
      }))
    )

    return (
      <CursorWithAttachedElementStoreContext.Provider value={store}>
        { children }
      </CursorWithAttachedElementStoreContext.Provider>
    )
}

// thought proccess:
// it's neither a tooltip nor a hovercard,
// it follow the mouse so the user can never click on it,
// it's more akin to a custom cursor like the one in figma with your name on it.
export const CursorWithAttachedElement = ({ children }: { children: React.ReactNode }) => {
  return (
    <CursorWithAttachedElementStoreProvider>
      <TooltipProviderWithHoverState>
        { children }
      </TooltipProviderWithHoverState>
    </CursorWithAttachedElementStoreProvider>
  )
}

const TooltipProviderWithHoverState = ({ children }: { children: React.ReactNode }) => {
  const store = useContext(CursorWithAttachedElementStoreContext)
  const isHovering = useStore(store, state => state.isHovering)
  const id = React.useId()

  return (
    <TooltipProvider key={id} open={isHovering}>
      {children}
    </TooltipProvider>
  )
}

export const CursorWithAttachedElementTrigger = ({ children }: { children: React.ReactNode}) => {
  // don't need to track hover state here, can subscribe in the element that appears
  // to avoid re-rendering the trigger
  const ref = React.useRef<HTMLDivElement>(null!) // TODO: probably wanna compose ref when I start using children here
  const store = useContext(CursorWithAttachedElementStoreContext)
  const setIsHovering = useStore(store, state => state.setIsHovering)
  const tooltipStore = useTooltipContext()


  return(
    <div ref={ref}
      onPointerLeave={() => {
        console.log("leave");
        if(!tooltipStore){
          console.log("no tooltipStore")
        }
        setIsHovering(false)
       tooltipStore?.setOpen(false)
      }}
      onPointerEnter={() => {
        console.log("enter")
        setIsHovering(true)
        tooltipStore?.setOpen(true)
      }}
      className="cursor-alias"
    >
      { children }
    </div>
  )

}

export const CursorWithAttachedElementContent = ({ children }: { children: React.ReactNode}) => {
    return (
      <AttachedElement>
        { children }
      </AttachedElement>
  )
}

const MotionTooltipAnchor = motion.create(TooltipAnchor)

const AttachedElement = ({ children }: { children?: React.ReactNode }) => {
  const cursorPositionStore = useContext(CursorPositionStoreContext)
  const cursorWithAttachmentStore = useContext(CursorWithAttachedElementStoreContext)
  const pos = useStore(cursorPositionStore, state => state.pos)
  const isShown = useStore(cursorWithAttachmentStore, state => state.isHovering)

  return (
    <>
      <AnimatePresence>
        {isShown ?
            <Portal>
              <MotionTooltipAnchor className="absolute top-0 left-0 pointer-events-none" style={pos} />
              <Tooltip
                shift={144} // in the real world, this would measure the child to choose the side it starts at
                className="pointer-events-none"
              >
                {children}
              </Tooltip>
            </Portal>
          : null
        }
      </AnimatePresence>
    </>
  )
}

export const AnimatedElements = ({ animation }: { animation: animationFnName }) => {
  const media = [
    {
      src: "https://igorbedesqui.com/_next/image?url=%2Fimages%2Fprojs%2Fthe-manual%2F1.jpg&w=1920&q=75",
      type: "image"
    },
    {
      src: "https://igorbedesqui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdesktop-screenshot.c3599435.png&w=3840&q=75",
      type: "image"
    },
    {
      src: "https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/sRGuzPg7aefddqqyQhgHTZi2sM53/rDbRz9x7nIoBUpLrGOP3/624244f2-1e6d-461b-b189-e0d1c4750ebe.mp4?_a=DATAdtAAZAA0",
      type: "video"
    }
  ]
  const duration = .2

 return (
   <div className="grid grid-cols-1 grid-rows-1">
    {
      media.map((item, i) => (
        <motion.div
            key={`${item.src}-${i}`}
            {...animationFns[animation](i, duration)}
            className="shadow row-start-1 row-end-1 col-start-1 col-end-1 rounded-sm"
          >
            <div className="w-36 bg-gray-A04 ring-1 ring-gray-A05 rounded-inherit overflow-hidden">
          {item.type === 'image' ? (
            <Image src={item.src} alt="" width={144} height={144} className="w-full h-auto" />
          ) : (
            <video src={item.src} autoPlay loop muted playsInline />
          )}
            </div>
          </motion.div>
      ))
    }
   </div>
 )
}
const bouncyAnimation = (i: number, duration: number) => {
  return {
    initial: { scale: .5, opacity: 0, rotate: 0 },
    animate: { scale: 1, opacity: 1, rotate: i !== 0 ? 10 * (i % 2 === 0 ? -1 : 1) : 0 },
    exit: { scale: .5, opacity: 0 },
    transition: {
      ease: [0.175, 0.885, 0.32, 1.275],
      duration: duration,
      delay: (i * duration) * .3
    },
    style: {
      marginLeft: `${i * 30}px`,
      marginTop: i !== 0 ? `${20 * (i % 2 === 0 ? 1 : -1)}px` : 0,
    }
  }
}

const glitchAnimation = (i: number, duration: number) => {
  return {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: [0, 1, 0, 1, 0, 1],
    },
    exit: {
      opacity: [1, 0, 1, 0, 1, 0],
    },
    transition: {
      duration: duration,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      delay: (i * duration) * .3
    },
    style: {
      marginLeft: `${i * 30}px`,
      marginTop: i !== 0 ? `${20 * (i % 2 === 0 ? 1 : -1)}px` : 0,
    }
  };
};

const animationFns = {
  "bouncy": bouncyAnimation,
  "glichy": glitchAnimation
} as const
type animationFnName = keyof typeof animationFns
