import ColorHash from "color-hash"

const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.8 })

export const getColorById = id => colorHash.hex(id)
