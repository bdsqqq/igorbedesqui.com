"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { createStore, StoreApi } from "zustand/vanilla"
import { motion } from "motion/react"

type CursorPositionStore = {
  pos: {x: number, y: number}
  updatePos: (x: number, y: number) => void
}
const LocalCursorPositionStoreContext = React.createContext<StoreApi<CursorPositionStore>>(null!)
export const LocalCursorPositionStoreProvider = ({ children }: {children: React.ReactNode}) => {
  const [store] = useState(() =>
    createStore<CursorPositionStore>((set, get) => ({
      pos: { x: 0, y: 0 },
      updatePos: (x: number, y: number) => {
        set({ pos: { x, y } })
      }
    }))
  );

  return (
    <LocalCursorPositionStoreContext.Provider value={store}>
      {children}
    </LocalCursorPositionStoreContext.Provider>
  )
}

export const Test = () => {
  const cursorPositionStore = useContext(LocalCursorPositionStoreContext)
  const updatePos = useStore(cursorPositionStore, state => state.updatePos)


  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updatePos(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    },
    [updatePos]
  )

  return (
    <div className="relative w-full h-16 bg-gray-A03 border border-gray-A05 rounded" onMouseMove={handleMouseMove}>
      <Crosshair />
    </div>
  )
}

const Crosshair = () => {
  const cursorPositionStore = useContext(LocalCursorPositionStoreContext)
  const pos = useStore(cursorPositionStore, state => state.pos)

  return <motion.div className="absolute pointer-events-none bg-gray-12 rounded h-1 w-1" style={pos}  />
}
