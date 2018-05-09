import ColorHash from "color-hash"
import localforage from "localforage"

const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.8 })

export const getColorById = id => colorHash.hex(id)

export const loadLocalTournaments = async () =>
  (await localforage.getItem("tournaments")) || {}
